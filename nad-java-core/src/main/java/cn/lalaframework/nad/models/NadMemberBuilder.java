package cn.lalaframework.nad.models;

import cn.lalaframework.nad.dto.NadAnnotation;
import cn.lalaframework.nad.dto.NadMember;
import cn.lalaframework.nad.dto.impl.NadAnnotationImpl;
import cn.lalaframework.nad.dto.impl.NadMemberImpl;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class NadMemberBuilder {
    @NonNull
    private final String name;
    @Nullable
    private Method getter;
    @Nullable
    private Method setter;
    @Nullable
    private Field field;

    protected NadMemberBuilder(@NonNull String name) {
        this.name = name;
    }

    @NonNull
    public static List<NadMember> buildMemberList(@NonNull Class<?> clz) {
        // Use a TreeMap to keep the order of the items.
        NadMemberMap result = new NadMemberMap();

        // Collect the methods and fields.
        // IMPORTANT: Methods must be collected first before fields.
        // Because taking out the field alone we cannot know whether it is accessible or not.
        // We have to determine the accessibility of a field based on the corresponding accessor methods.
        Arrays.stream(clz.getDeclaredMethods()).forEach(result::addMethod);
        Arrays.stream(clz.getDeclaredFields()).forEach(result::addField);

        // Build all NadMember classes into a list.
        return result.values().stream().map(NadMemberBuilder::build).collect(Collectors.toList());
    }

    /**
     * Calculates the annotations from field and accessor methods.
     *
     * @return A tuple of three items (as a List).
     *         they represent the annotation list of field, getter, and setter, respectively.
     */
    @NonNull
    private List<List<NadAnnotation>> buildAnnotations() {

        return Stream.of(field, getter, setter)
                .map(i -> i != null ? NadAnnotationImpl.fromAnnotatedElement(i) : null)
                .collect(Collectors.toList());
    }

    /**
     * Calculates the member type from field and accessor methods.
     *
     * @return A typeName string, that has collected by NadContext.
     */
    @NonNull
    private String buildType() {
        Type javaType = null;
        if (getter != null) {
            javaType = getter.getGenericReturnType();
        } else if (field != null) {
            javaType = field.getGenericType();
        } else if (setter != null) {
            javaType = Arrays.stream(setter.getGenericParameterTypes()).findFirst().orElse(null);
        }
        if (javaType != null) {
            NadContext.collect(javaType);
            return javaType.getTypeName();
        }
        return "unknown";
    }

    /**
     * Link this member to a getter method.
     *
     * @param getter A getter method object.
     */
    public void linkToGetter(@NonNull Method getter) {
        this.getter = getter;
    }

    /**
     * Link this member to a setter method.
     *
     * @param setter A setter method object.
     */
    public void linkToSetter(@NonNull Method setter) {
        this.setter = setter;
    }

    /**
     * Link this member to a field.
     *
     * @param field A field object.
     */
    public void linkToProperty(@NonNull Field field) {
        this.field = field;
    }

    /**
     * Build a real NadMember object from the parameters of this builder.
     */
    @NonNull
    public NadMember build() {
        return new NadMemberImpl(name, buildType(), buildAnnotations());
    }
}
