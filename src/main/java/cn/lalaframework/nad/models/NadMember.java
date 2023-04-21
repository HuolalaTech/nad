package cn.lalaframework.nad.models;

import cn.lalaframework.nad.NadContext;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class NadMember {
    @NonNull
    private final String name;
    @Nullable
    private Method getter;
    @Nullable
    private Method setter;
    @Nullable
    private Field field;
    @Nullable
    private String type;

    protected NadMember(@NonNull String name) {
        this.name = name;
        this.type = "unknown";
    }

    protected void linkToGetter(Method getter) {
        this.getter = getter;
    }

    protected void linkToSetter(Method setter) {
        this.setter = setter;
    }

    protected void linkToProperty(Field field) {
        this.field = field;
    }

    protected void compute() {
        Type javaType = null;
        if (getter != null) {
            javaType = getter.getGenericReturnType();
        } else if (field != null) {
            javaType = field.getGenericType();
        } else if (setter != null) {
            Type[] parameterTypes = setter.getGenericParameterTypes();
            if (parameterTypes.length > 0) {
                javaType = parameterTypes[0];
            }
        }
        if (javaType != null) {
            NadContext.collect(javaType);
            type = javaType.getTypeName();
        }
    }

    @NonNull
    public List<List<NadAnnotation>> getAnnotations() {
        return Stream.of(field, getter, setter)
                .map(i -> i != null ? NadAnnotation.fromAnnotatedElement(i) : null)
                .collect(Collectors.toList());
    }

    @NonNull
    public String getName() {
        return name;
    }

    @Nullable
    public String getType() {
        return type;
    }
}
