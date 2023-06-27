package cn.lalaframework.nad.models;

import cn.lalaframework.nad.interfaces.NadClass;
import cn.lalaframework.nad.interfaces.NadMember;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class NadClassImpl extends NadDefImpl implements NadClass {
    @NonNull
    private final List<String> typeParameters;

    @NonNull
    private final List<NadMember> members;

    @Nullable
    private final String superclass;

    @NonNull
    private final List<String> interfaces;

    /**
     * Create a NadClass from a standard java class.
     *
     * @param clz A standard java class.
     */
    public NadClassImpl(Class<?> clz) {
        super(clz);
        // For each generic type parameter, collect them and convert to type name strings.
        typeParameters = Arrays.stream(clz.getTypeParameters()).map(NadClassImpl::cc).collect(Collectors.toList());

        // Convert fields and methods of class to a NadMember object.
        // This logic is very complex, so a NadMemberBuilder class is used to handle it.
        members = NadMemberBuilder.buildMemberList(clz);

        // Get the superclass of specified class, collect it and convert to a type name string.
        // NOTE: It may be null.
        superclass = Optional.ofNullable(clz.getGenericSuperclass()).map(NadClassImpl::cc).orElse(null);

        // For each interface, collect them and convert to type name strings.
        interfaces = Arrays.stream(clz.getGenericInterfaces()).map(NadClassImpl::cc).collect(Collectors.toList());
    }

    /**
     * Collect type to NadContext and convert to a type name string.
     *
     * @param type A type.
     * @return Associated type name string.
     */
    private static String cc(Type type) {
        NadContext.collect(type);
        return type.getTypeName();
    }

    @Override
    @Nullable
    public String getSuperclass() {
        return superclass;
    }

    @Override
    @NonNull
    public List<NadMember> getMembers() {
        return members;
    }

    @Override
    @NonNull
    public List<String> getTypeParameters() {
        return typeParameters;
    }

    @Override
    @NonNull
    public List<String> getInterfaces() {
        return interfaces;
    }
}