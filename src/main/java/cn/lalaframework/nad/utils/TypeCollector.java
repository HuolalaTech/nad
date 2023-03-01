package cn.lalaframework.nad.utils;

import cn.lalaframework.nad.exceptions.BadTypeCollectorStateException;
import cn.lalaframework.nad.models.ClassFilter;
import cn.lalaframework.nad.models.NadClass;
import cn.lalaframework.nad.models.NadEnum;
import org.springframework.lang.NonNull;

import java.lang.reflect.GenericArrayType;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.*;

public class TypeCollector {
    private static final ThreadLocal<TreeMap<String, NadClass>> classesMapRef = new ThreadLocal<>();
    private static final ThreadLocal<TreeMap<String, NadEnum>> enumsMapRef = new ThreadLocal<>();
    private static final ThreadLocal<ClassFilter> classFilterRef = new ThreadLocal<>();

    private TypeCollector() {
        throw new IllegalStateException("Utility class");
    }

    @NonNull
    private static Map<String, NadClass> getClassesMap() {
        TreeMap<String, NadClass> map = classesMapRef.get();
        if (map != null) return map;
        throw new BadTypeCollectorStateException();
    }

    @NonNull
    private static Map<String, NadEnum> getEnumsMap() {
        TreeMap<String, NadEnum> map = enumsMapRef.get();
        if (map != null) return map;
        throw new BadTypeCollectorStateException();
    }

    public static void setClassFilter(ClassFilter classFilter) {
        classFilterRef.set(classFilter);
    }

    /**
     * Collect all seen types.
     */
    public static void collect(Type what) {
        // For ParameterizedType such as Map<String, Integer>, we need to collect all raw types and type arguments.
        // For example, collect(A<B, C>) is equals to collect(A), and collect(B), and collect(C).
        if (what instanceof ParameterizedType) {
            ParameterizedType pt = (ParameterizedType) what;
            collect(pt.getRawType());
            Arrays.stream(pt.getActualTypeArguments()).forEach(TypeCollector::collect);
            return;
        }

        // Find the type of array items, such as find List<Long> from List<Long>[].
        if (what instanceof GenericArrayType) {
            collect(((GenericArrayType) what).getGenericComponentType());
            return;
        }

        if (what instanceof Class) {
            collectClass((Class<?>) what);
        }
    }

    /**
     * Collect all seen classes and that contained types.
     */
    public static void collectClass(Class<?> clz) {
        // Don't collect primitive types.
        if (clz.isPrimitive()) return;

        // Find the T of T[].
        if (clz.isArray()) {
            collect(clz.getComponentType());
            return;
        }

        // It's an enum type.
        if (clz.isEnum()) {
            @SuppressWarnings("unchecked")
            Class<? extends Enum<?>> aEnum = (Class<? extends Enum<?>>) clz;
            collectEnum(aEnum);
            return;
        }

        // Now, The clz is a pure Java class type (not an array).
        String name = clz.getTypeName();

        // Ignore some classes which are matched by classFilter.
        ClassFilter classFilter = classFilterRef.get();
        if (classFilter != null && classFilter.match(name)) return;

        Map<String, NadClass> map = getClassesMap();

        // Don't collect it again, if it has been collected.
        // This is very important to avoid endless recursion, that is the breaking condition for recursion.
        if (map.containsKey(name)) return;
        // Place a null as a placeholder to mark the current class being collected, to avoid recursively collecting it.
        // noinspection OverwrittenKey
        map.put(name, null); // NOSONAR

        // IMPORTANT: new NadClass(...) may potentially call collectClass recursively.
        // noinspection OverwrittenKey
        map.put(name, new NadClass(clz)); // NOSONAR
    }

    private static void collectEnum(Class<? extends Enum<?>> clz) {
        getEnumsMap().computeIfAbsent(clz.getTypeName(), name -> new NadEnum(clz));
    }

    @NonNull
    public static List<NadClass> dumpClasses() {
        return new ArrayList<>(getClassesMap().values());
    }

    @NonNull
    public static List<NadEnum> dumpEnums() {
        return new ArrayList<>(getEnumsMap().values());
    }

    public static void start(ClassFilter classFilter) {
        classesMapRef.set(new TreeMap<>());
        enumsMapRef.set(new TreeMap<>());
        classFilterRef.set(classFilter);
    }

    public static void end() {
        classesMapRef.remove();
        enumsMapRef.remove();
        classFilterRef.remove();
    }
}
