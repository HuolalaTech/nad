package cn.lalaframework.nad.dto.impl;

import cn.lalaframework.nad.dto.NadAnnotation;
import cn.lalaframework.nad.dto.NadDef;
import org.springframework.lang.NonNull;

import java.util.List;

public class NadDefImpl implements NadDef {
    @NonNull
    private final String name;
    @NonNull
    private final List<NadAnnotation> annotations;

    public NadDefImpl(@NonNull Class<?> clz) {
        name = clz.getTypeName();
        annotations = NadAnnotationImpl.fromAnnotatedElement(clz);
    }

    @Override
    @NonNull
    public String getName() {
        return name;
    }

    @Override
    @NonNull
    public List<NadAnnotation> getAnnotations() {
        return annotations;
    }
}
