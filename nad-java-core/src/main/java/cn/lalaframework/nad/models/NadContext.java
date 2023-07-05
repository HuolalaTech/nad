package cn.lalaframework.nad.models;

import cn.lalaframework.nad.exceptions.NadContextRecursionException;
import cn.lalaframework.nad.exceptions.NoNadContextException;
import cn.lalaframework.nad.interfaces.*;
import org.springframework.aop.ClassFilter;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.lang.reflect.GenericArrayType;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.*;
import java.util.function.Supplier;

public class NadContext {
    @NonNull
    private static final ThreadLocal<NadContext> current = new ThreadLocal<>();

    @NonNull
    private final TreeMap<String, NadClass> classesMap;

    @NonNull
    private final TreeMap<String, NadModule> modulesMap;

    @NonNull
    private final TreeMap<String, NadEnum> enumsMap;

    @NonNull
    private final TreeSet<NadRoute> routes;

    @Nullable
    private final ClassFilter classExcluder;

    private NadContext(@Nullable ClassFilter excluder) {
        classExcluder = excluder;
        classesMap = new TreeMap<>();
        enumsMap = new TreeMap<>();
        modulesMap = new TreeMap<>();

        // To ensure that uniformity of the results, it is necessary to be sorted.
        // NOTE: The HandlerMethods object is unsorted.
        routes = new TreeSet<>(Comparator.comparing(NadRoute::getSortKey));
    }

    /**
     * Get current context instance and asserts that it is not null.
     * Note: if this method is called outside a NadContext transaction, an error will occur.
     */
    @NonNull
    private static NadContext getContext() {
        NadContext context = current.get();
        if (context == null) throw new NoNadContextException();
        return context;
    }

    /**
     * Collect a Class type.
     * NOTE: the matchClass method will be called, if a class is excluded by classExcluder, it will not be collected.
     */
    private static void collectClass(@NonNull Class<?> clz) {
        // Don't collect primitive types.
        if (clz.isPrimitive()) return;

        // Find the T of T[].
        if (clz.isArray()) {
            collectType(clz.getComponentType());
            return;
        }

        // It's an enum type.
        if (clz.isEnum()) {
            @SuppressWarnings("unchecked")
            Class<? extends Enum<?>> aEnum = (Class<? extends Enum<?>>) clz;
            collectEnum(aEnum);
            return;
        }

        // Ignore some classes which are matched by ClassFilter.
        if (!matchClass(clz)) return;

        // Now, The clz is a pure Java class type (not an array).
        String name = clz.getTypeName();

        Map<String, NadClass> map = getContext().classesMap;

        // Don't collect it again, if it has been collected.
        // This is very important to avoid endless recursion, that is the breaking condition for recursion.
        if (map.containsKey(name)) return;
        // Place a null as a placeholder to mark the current class being collected, to avoid recursively collecting it.
        // noinspection OverwrittenKey
        map.put(name, null); // NOSONAR

        // IMPORTANT: new NadClassImpl(...) may potentially call collectClass recursively.
        // noinspection OverwrittenKey
        map.put(name, new NadClassImpl(clz)); // NOSONAR
    }

    /**
     * Collect an Enum type.
     * NOTE: the matchClass method will be called, if a class is excluded by classExcluder, it will not be collected.
     */
    private static void collectEnum(@NonNull Class<? extends Enum<?>> clz) {
        // Ignore some classes which are matched by ClassFilter.
        if (!matchClass(clz)) return;
        getContext().enumsMap.computeIfAbsent(clz.getTypeName(), name -> new NadEnumImpl(clz));
    }

    /**
     * Collect module bean.
     * NOTE: the matchClass method will be called, if a class is excluded by classExcluder, it will not be collected.
     */
    protected static void collectModule(Class<?> clz) {
        getContext().modulesMap.computeIfAbsent(clz.getTypeName(), n -> new NadModuleImpl(clz));
    }

    /**
     * Collect all seen types.
     * NOTE: the matchClass method will be called, if a class is excluded by classExcluder, it will not be collected.
     */
    protected static void collectType(@Nullable Type what) {
        // For ParameterizedType such as Map<String, Integer>, we need to collect all raw types and type arguments.
        // For example, collect(A<B, C>) is equals to collect(A), and collect(B), and collect(C).
        if (what instanceof ParameterizedType) {
            ParameterizedType pt = (ParameterizedType) what;
            collectType(pt.getRawType());
            Arrays.stream(pt.getActualTypeArguments()).forEach(NadContext::collectType);
            return;
        }

        // Find the type of array items, such as find List<Long> from List<Long>[].
        if (what instanceof GenericArrayType) {
            collectType(((GenericArrayType) what).getGenericComponentType());
            return;
        }

        if (what instanceof Class) {
            collectClass((Class<?>) what);
        }
    }

    /**
     * Collect a route, you must first create a NadRoute object within the NadContext transaction.
     */
    public static void collectRoute(@Nullable NadRoute route) {
        Optional.ofNullable(route).ifPresent(getContext().routes::add);
    }

    public static void collectSpringWeb(@NonNull RequestMappingHandlerMapping mapping) {
        mapping.getHandlerMethods().entrySet().stream()
                // Ignore some classes who are specified by ClassExcluder
                .filter(e -> NadContext.matchClass(e.getValue().getBeanType()))
                .map(e -> new NadRouterSpringWeb(e.getKey(), e.getValue()))
                .forEach(NadContext::collectRoute);
    }

    /**
     * Check if the classes match.
     * NOTE: only matching classes can be collected (by classExcluder exclusion).
     */
    public static boolean matchClass(Class<?> clz) {
        ClassFilter classExcluder = getContext().classExcluder;
        // If ClassFilter are not provided, all classes are retained.
        if (classExcluder == null) return true;
        // The matchClass specifies which classes can be retained,
        // while the classExcluder indicates which classes should be excluded.
        // Therefore, the NOT operator is necessary here.
        return !classExcluder.matches(clz);
    }

    /**
     * Execute a transaction within a NadContext.
     * NOTE: context information is stored in a ThreadLocal, do not call this method recursively.
     */
    public static <R> R run(@NonNull Supplier<R> transaction, @Nullable ClassFilter classExcluder) {
        R res;
        try {
            if (current.get() != null) {
                throw new NadContextRecursionException();
            }
            current.set(new NadContext(classExcluder));
            // if this code returns directly, the "finally" block will not be covered by junit coverage.
            res = transaction.get();
        } finally {
            current.remove();
        }
        return res;
    }

    /**
     * Dump all information of current content into a NadResult.
     */
    @NonNull
    public static NadResult dump() {
        NadContext context = getContext();
        return new NadResultImpl(
                new ArrayList<>(context.modulesMap.values()),
                new ArrayList<>(context.routes),
                new ArrayList<>(context.classesMap.values()),
                new ArrayList<>(context.enumsMap.values())
        );
    }
}
