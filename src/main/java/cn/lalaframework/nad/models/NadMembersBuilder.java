package cn.lalaframework.nad.models;

import org.springframework.util.StringUtils;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.*;

public class NadMembersBuilder {
    private final Map<String, NadMember> result;

    public NadMembersBuilder(Class<?> clz) {
        result = new TreeMap<>(String::compareTo);
        Arrays.stream(clz.getDeclaredMethods()).forEach(this::addMethod);
        Arrays.stream(clz.getDeclaredFields()).forEach(this::addField);
        result.values().forEach(NadMember::compute);
    }

    public List<NadMember> build() {
        return new ArrayList<>(result.values());
    }

    private void addMethod(Method method) {
        int m = method.getModifiers();
        if (!Modifier.isPublic(m) || Modifier.isStatic(m)) return;
        String methodName = method.getName();
        int argc = method.getParameters().length;
        if (methodName.startsWith("get") && argc == 0) {
            result.computeIfAbsent(
                    StringUtils.uncapitalize(methodName.substring(3)),
                    NadMember::new
            ).linkToGetter(method);
        } else if (methodName.startsWith("set") && argc == 1) {
            result.computeIfAbsent(
                    StringUtils.uncapitalize(methodName.substring(3)),
                    NadMember::new
            ).linkToSetter(method);
        } else if (methodName.startsWith("is") && argc == 0) {
            Class<?> rt = method.getReturnType();
            if (boolean.class == rt || Boolean.class == rt) {
                result.computeIfAbsent(
                        StringUtils.uncapitalize(methodName.substring(2)),
                        NadMember::new
                ).linkToGetter(method);
            }
        }
    }

    private void addField(Field field) {
        int m = field.getModifiers();
        if (Modifier.isStatic(m)) return;
        String name = field.getName();
        // Related with getter/setter.
        if (result.containsKey(name)) {
            result.get(name).linkToProperty(field);
        }
        // For public fields.
        else if (Modifier.isPublic(m) && !Modifier.isTransient(m)) {
            NadMember member = result.computeIfAbsent(name, NadMember::new);
            member.linkToProperty(field);
        }
    }
}
