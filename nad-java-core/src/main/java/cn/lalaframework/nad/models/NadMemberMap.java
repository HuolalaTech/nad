package cn.lalaframework.nad.models;

import org.springframework.lang.NonNull;
import org.springframework.util.StringUtils;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.TreeMap;

class NadMemberMap extends TreeMap<String, NadMemberBuilder> {
    protected NadMemberMap() {
        super(String::compareTo);
    }

    /**
     * Check if the return type of a method is a boolean or Java.lang.Boolean.
     *
     * @param method A method.
     */
    private static boolean isReturnBoolean(@NonNull Method method) {
        Class<?> clz = method.getReturnType();
        return boolean.class == clz || Boolean.class == clz;
    }

    /**
     * Get or create (if absent) a member by methodName.
     *
     * @param methodName    A method name.
     * @param trimLeftChars How many left characters need to be trimmed.
     *                      For example, "getFoo" should to be trimmed 3 chars to the left remove leading "get".
     * @return A NadMemberBuilder object that will never null.
     */
    @NonNull
    private NadMemberBuilder createOrGetMember(@NonNull String methodName, int trimLeftChars) {
        String memberName = StringUtils.uncapitalize(methodName.substring(trimLeftChars));
        return computeIfAbsent(memberName, NadMemberBuilder::new);
    }

    /**
     * Collect a method of the class.
     * NOTE: this method is used only by NadMemberBuild, so it is defined as protected.
     *
     * @param method A method.
     */
    protected void addMethod(@NonNull Method method) {
        int m = method.getModifiers();
        if (!Modifier.isPublic(m) || Modifier.isStatic(m)) return;
        String methodName = method.getName();
        int argc = method.getParameters().length;
        // A standard getter method starts with "get" and takes zero arguments.
        if (methodName.startsWith("get") && argc == 0) {
            createOrGetMember(methodName, 3).linkToGetter(method);
        }
        // A standard setter method starts with "set" and takes one argument.
        else if (methodName.startsWith("set") && argc == 1) {
            createOrGetMember(methodName, 3).linkToSetter(method);
        }
        // A boolean getter method starts with "is" and takes zero arguments and return a boolean type.
        else if (methodName.startsWith("is") && argc == 0 && isReturnBoolean(method)) {
            createOrGetMember(methodName, 2).linkToGetter(method);
        }
        // Otherwise, the method is not an accessor, so there is nothing to do.
    }

    /**
     * Collect a field of the class.
     * NOTE: this method is used only by NadMemberBuild, so it is defined as protected.
     *
     * @param field A field.
     */
    protected void addField(@NonNull Field field) {
        int m = field.getModifiers();
        if (Modifier.isStatic(m)) return;
        String name = field.getName();
        // Related with getter/setter.
        if (containsKey(name)) {
            get(name).linkToProperty(field);
        }
        // For public fields.
        else if (Modifier.isPublic(m) && !Modifier.isTransient(m)) {
            NadMemberBuilder member = computeIfAbsent(name, NadMemberBuilder::new);
            member.linkToProperty(field);
        }
        // Otherwise, the field is private and not accessible,
        // so there is nothing to do (ignore the field).
    }
}
