package cn.lalaframework.nad.models;

import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class NadEnumConstant<T extends Enum<T>> {
    private final String name;

    // An enum value can be serialized to an unknown value and type,
    // this field is used to tall the frontend what the serialized value is.
    private final Enum<T> value;

    private final Map<String, Object> properties;

    public NadEnumConstant(Enum<T> value, List<Field> fields) {
        this.name = value.name();
        this.value = value;
        properties = new TreeMap<>(String::compareTo);
        // Collectors.toMap cannot support null values, so use forEach instead.
        fields.forEach(field -> properties.put(field.getName(), ReflectionUtils.getField(field, value)));
    }

    public String getName() {
        return name;
    }

    public Map<String, Object> getProperties() {
        return properties;
    }

    public Enum<T> getValue() {
        return value;
    }
}
