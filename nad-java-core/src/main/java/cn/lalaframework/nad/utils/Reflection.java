package cn.lalaframework.nad.utils;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class Reflection {
    private Reflection() {
        throw new IllegalStateException("Utility class");
    }

    public static Object invokeMethod(Object info, String methodName) {
        if (info == null) return null;
        try {
            Method method = info.getClass().getDeclaredMethod(methodName);
            return method.invoke(info);
        } catch (InvocationTargetException | NoSuchMethodException | IllegalAccessException e) {
            return null;
        }
    }
}
