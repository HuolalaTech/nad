package cn.lalaframework.nad.models;

import cn.lalaframework.nad.interfaces.NadAnnotation;
import cn.lalaframework.nad.interfaces.NadEnumConstant;
import org.springframework.lang.NonNull;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.lang.reflect.Type;
import java.util.*;

public class NadEnumConstantImpl extends NadDefImpl implements NadEnumConstant {
    /**
     * An enum value can be serialized to an unknown value and type,
     * this field is used to tall the frontend what the serialized value is.
     */
    @NonNull
    private final Enum<?> value;

    @NonNull
    private final Map<String, Object> properties;

    public NadEnumConstantImpl(@NonNull Enum<?> enumValue, @NonNull List<Field> fields) {
        super(enumValue.name(), initAnnotations(enumValue));
        this.value = enumValue;
        properties = new TreeMap<>(String::compareTo);
        // Collectors.toMap cannot support null values, so use forEach instead.
        fields.forEach(field -> {
            try {
                Object fieldValue = ReflectionUtils.getField(field, enumValue);
                if (fieldValue instanceof Type) NadContext.collectType((Type) fieldValue);
                properties.put(field.getName(), fieldValue);
            } catch (IllegalStateException ignored) {
                // Some internal properties cannot be read.
            }
        });
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
}
