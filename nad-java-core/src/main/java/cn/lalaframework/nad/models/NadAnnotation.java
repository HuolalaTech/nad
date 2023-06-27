package cn.lalaframework.nad.models;

import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.lang.NonNull;

import java.lang.annotation.Annotation;
import java.lang.reflect.AnnotatedElement;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class NadAnnotation {
    @NonNull
    private final String type;
    @NonNull
    private final Map<String, Object> attributes;

    public NadAnnotation(@NonNull Annotation a) {
        type = a.annotationType().getTypeName();
        attributes = AnnotationUtils.getAnnotationAttributes(a);
    }

    @NonNull
    protected static List<NadAnnotation> fromArray(Annotation[] annotations) {
        return Arrays.stream(annotations).map(NadAnnotation::new).collect(Collectors.toList());
    }

    @NonNull
    protected static List<NadAnnotation> fromAnnotatedElement(@NonNull AnnotatedElement annotatedElement) {
        return fromArray(annotatedElement.getDeclaredAnnotations());
    }

    @NonNull
    public String getType() {
        return type;
    }

    @NonNull
    public Map<String, Object> getAttributes() {
        return attributes;
    }
}
