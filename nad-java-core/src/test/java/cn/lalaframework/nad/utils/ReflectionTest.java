package cn.lalaframework.nad.utils;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Modifier;

class ReflectionTest {
    @Test
    void success() {
        Object res = Reflection.invokeMethod(String.class, "getTypeName");
        Assertions.assertEquals(String.class.getTypeName(), res);
    }

    @Test
    void notFound() {
        Object res = Reflection.invokeMethod(String.class, "methodIsNotFound");
        Assertions.assertNull(res);
    }

    @Test
    void construct() throws NoSuchMethodException {
        Constructor<Reflection> constructor = Reflection.class.getDeclaredConstructor();
        Assertions.assertTrue(Modifier.isPrivate(constructor.getModifiers()));
        constructor.setAccessible(true);
        try {
            constructor.newInstance();
        } catch (InvocationTargetException | InstantiationException | IllegalAccessException e) {
            Assertions.assertTrue(e instanceof InvocationTargetException);
            Assertions.assertTrue(((InvocationTargetException) e).getTargetException() instanceof IllegalStateException);
        }
    }
}