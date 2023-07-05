package cn.lalaframework.nad.utils;

import org.junit.jupiter.api.Test;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Modifier;

import static org.junit.jupiter.api.Assertions.*;

class ReflectionTest {
    @Test
    void success() {
        Object res = Reflection.invokeMethod(String.class, "getTypeName");
        assertEquals(String.class.getTypeName(), res);
    }

    @Test
    void notFound() {
        Object res = Reflection.invokeMethod(String.class, "methodIsNotFound");
        assertNull(res);
    }

    @SuppressWarnings("ConstantValue")
    @Test
    void baseNull() {
        Object res = Reflection.invokeMethod(null, "foo");
        assertNull(res);
    }

    @Test
    void construct() throws NoSuchMethodException {
        Constructor<Reflection> constructor = Reflection.class.getDeclaredConstructor();
        assertTrue(Modifier.isPrivate(constructor.getModifiers()));
        constructor.setAccessible(true);
        try {
            constructor.newInstance();
        } catch (InvocationTargetException | InstantiationException | IllegalAccessException e) {
            assertTrue(e instanceof InvocationTargetException);
            assertTrue(((InvocationTargetException) e).getTargetException() instanceof IllegalStateException);
        }
    }
}