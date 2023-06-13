package cn.lalaframework.nad.models;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class NadClass extends NadDef {
    @NonNull
    private final List<String> typeParameters;

    @NonNull
    private final List<NadMember> members;

    @Nullable
    private final String superclass;

    @NonNull
    private final List<String> interfaces;

    public NadClass(Class<?> clz) {
        super(clz);
        typeParameters = Arrays.stream(clz.getTypeParameters()).map(type -> {
            NadContext.collect(type);
            return type.getTypeName();
        }).collect(Collectors.toList());

        members = NadMemberBuilder.buildMemberList(clz);

        Type genericSuperclass = clz.getGenericSuperclass();
        if (genericSuperclass == null) {
            superclass = null;
        } else {
            NadContext.collect(genericSuperclass);
            superclass = genericSuperclass.getTypeName();
        }

        interfaces = Arrays.stream(clz.getGenericInterfaces()).map(type -> {
            NadContext.collect(type);
            return type.getTypeName();
        }).collect(Collectors.toList());
    }

    @Nullable
    public String getSuperclass() {
        return superclass;
    }

    @NonNull
    public List<NadMember> getMembers() {
        return members;
    }

    @NonNull
    public List<String> getTypeParameters() {
        return typeParameters;
    }

    @NonNull
    public List<String> getInterfaces() {
        return interfaces;
    }
}