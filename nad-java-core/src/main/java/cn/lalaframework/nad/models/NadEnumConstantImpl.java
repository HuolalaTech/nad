package cn.lalaframework.nad.models;

import cn.lalaframework.nad.interfaces.NadAnnotation;
import cn.lalaframework.nad.interfaces.NadEnumConstant;
import org.springframework.lang.NonNull;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.util.*;

public class NadEnumConstantImpl implements NadEnumConstant {
    @NonNull
    private final String name;

    /**
     * An enum value can be serialized to an unknown value and type,
     * this field is used to tall the frontend what the serialized value is.
     */
    @NonNull
    private final Enum<?> value;

    @NonNull
    private final Map<String, Object> properties;

    @NonNull
    private final List<NadAnnotation> annotations;

    public NadEnumConstantImpl(@NonNull Enum<?> value, @NonNull List<Field> fields) {
        annotations = initAnnotations(value);
        name = value.name();
        this.value = value;
        properties = new TreeMap<>(String::compareTo);
        // Collectors.toMap cannot support null values, so use forEach instead.
        fields.forEach(field -> properties.put(field.getName(), ReflectionUtils.getField(field, value)));
    }

    private static List<NadAnnotation> initAnnotations(@NonNull Enum<?> value) {
        return Arrays
                // Find the field by specified enum value name.
                .stream(value.getClass().getDeclaredFields())
                .filter(field -> field.getName().equals(value.name()))
                .findFirst()
                // Convert to NadAnnotation list
                .map(NadAnnotationImpl::fromAnnotatedElement)
                .orElseGet(ArrayList::new);
    }

    @Override
    @NonNull
    public String getName() {
        return name;
    }

    @Override
    @NonNull
    public Map<String, Object> getProperties() {
        return properties;
    }

    @Override
    @NonNull
    public <E extends Enum<E>> E getValue() {
        @SuppressWarnings("unchecked")
        E res = (E) value;
        return res;
    }

    @Override
    @NonNull
    public List<NadAnnotation> getAnnotations() {
        return annotations;
    }
}
