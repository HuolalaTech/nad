package cn.lalaframework.nad.models;

import org.springframework.lang.NonNull;

import java.util.List;

public class NadDef {
    @NonNull
    private final String name;
    @NonNull
    private final List<NadAnnotation> annotations;

    public NadDef(Class<?> clz) {
        name = clz.getTypeName();
        annotations = NadAnnotation.fromAnnotatedElement(clz);
    }

    @NonNull
    public String getName() {
        return name;
    }

    @NonNull
    public List<NadAnnotation> getAnnotations() {
        return annotations;
    }
}
