package cn.lalaframework.nad.dto.impl;

import cn.lalaframework.nad.dto.NadClass;
import cn.lalaframework.nad.models.NadContext;
import cn.lalaframework.nad.dto.NadMember;
import cn.lalaframework.nad.models.NadMemberBuilder;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.List;
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

    public NadClassImpl(Class<?> clz) {
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