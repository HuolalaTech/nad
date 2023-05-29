package cn.lalaframework.nad.models;

import org.springframework.lang.NonNull;
import org.springframework.util.StringUtils;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.TreeMap;

public class NadMemberMap extends TreeMap<String, NadMemberBuilder> {
    public NadMemberMap() {
        super(String::compareTo);
    }

    private static boolean isReturnBoolean(@NonNull Method method) {
        Class<?> clz = method.getReturnType();
        return boolean.class == clz || Boolean.class == clz;
    }

    @NonNull
    private NadMemberBuilder getMember(@NonNull String methodName, int beginIndex) {
        String memberName = StringUtils.uncapitalize(methodName.substring(beginIndex));
        return computeIfAbsent(memberName, NadMemberBuilder::new);
    }

    public void addMethod(@NonNull Method method) {
        int m = method.getModifiers();
        if (!Modifier.isPublic(m) || Modifier.isStatic(m)) return;
        String methodName = method.getName();
        int argc = method.getParameters().length;
        // A standard getter method starts with "get" and takes zero arguments.
        if (methodName.startsWith("get") && argc == 0) {
            getMember(methodName, 3).linkToGetter(method);
        }
        // A standard setter method starts with "set" and takes one argument.
        else if (methodName.startsWith("set") && argc == 1) {
            getMember(methodName, 3).linkToSetter(method);
        }
        // A boolean getter method starts with "is" and takes zero arguments and return a boolean type.
        else if (methodName.startsWith("is") && argc == 0 && isReturnBoolean(method)) {
            getMember(methodName, 2).linkToGetter(method);
        }
        // Otherwise, the method is not an accessor, so there is nothing to do.
    }

    public void addField(@NonNull Field field) {
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
