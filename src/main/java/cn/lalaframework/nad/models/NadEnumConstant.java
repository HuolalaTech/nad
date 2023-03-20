package cn.lalaframework.nad.models;

import org.springframework.lang.NonNull;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class NadEnumConstant<T extends Enum<T>> {
    @NonNull
    private final String name;

    // An enum value can be serialized to an unknown value and type,
    // this field is used to tall the frontend what the serialized value is.
    @NonNull
    private final Enum<T> value;

    @NonNull
    private final Map<String, Object> properties;

    @NonNull
    private final List<NadAnnotation> annotations;

    public NadEnumConstant(@NonNull Enum<T> value, @NonNull List<Field> fields) {
        annotations = initAnnotations(value);
        name = value.name();
        this.value = value;
        properties = new TreeMap<>(String::compareTo);
        // Collectors.toMap cannot support null values, so use forEach instead.
        fields.forEach(field -> properties.put(field.getName(), ReflectionUtils.getField(field, value)));
    }

    private static List<NadAnnotation> initAnnotations(Enum<?> value) {
        try {
            Field field = value.getClass().getDeclaredField(value.name());
            return NadAnnotation.fromAnnotatedElement(field);
        } catch (NoSuchFieldException e) {
            return new ArrayList<>();
        }
    }

    @NonNull
    public String getName() {
        return name;
    }

    @NonNull
    public Map<String, Object> getProperties() {
        return properties;
    }

    @NonNull
    public Enum<T> getValue() {
        return value;
    }

    @NonNull
    public List<NadAnnotation> getAnnotations() {
        return annotations;
    }
}
