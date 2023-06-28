package cn.lalaframework.nad.models;

import cn.lalaframework.nad.interfaces.NadAnnotation;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.lang.NonNull;

import java.lang.annotation.Annotation;
import java.lang.reflect.AnnotatedElement;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class NadAnnotationImpl implements NadAnnotation {
    @NonNull
    private final String type;
    @NonNull
    private final Map<String, Object> attributes;

    public NadAnnotationImpl(@NonNull Annotation a) {
        type = a.annotationType().getTypeName();
        attributes = AnnotationUtils.getAnnotationAttributes(a);
    }

    /**
     * Create a NadAnnotation list from an annotation list.
     *
     * @param annotations An annotation list object.
     * @return A list of NadAnnotation object.
     */
    @NonNull
    public static List<NadAnnotation> fromArray(Annotation[] annotations) {
        return Arrays.stream(annotations).map(NadAnnotationImpl::new).collect(Collectors.toList());
    }

    /**
     * Create a NadAnnotation list from an annotated element.
     * NOTE: This method will call the getDeclaredAnnotations method to get all annotations.
     *
     * @param annotatedElement An annotated element object.
     * @return A list of NadAnnotation object.
     */
    @NonNull
    public static List<NadAnnotation> fromAnnotatedElement(@NonNull AnnotatedElement annotatedElement) {
        return fromArray(annotatedElement.getDeclaredAnnotations());
    }

    @Override
    @NonNull
    public String getType() {
        return type;
    }

    @Override
    @NonNull
    public Map<String, Object> getAttributes() {
        return attributes;
    }
}
