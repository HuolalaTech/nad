package cn.lalaframework.nad;

import cn.lalaframework.nad.exceptions.NoNadContextException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Modifier;

class NadContextTest {
    @Test
    void construct() throws NoSuchMethodException {
        Constructor<NadContext> constructor = NadContext.class.getDeclaredConstructor();
        Assertions.assertTrue(Modifier.isPrivate(constructor.getModifiers()));
        constructor.setAccessible(true);
        try {
            constructor.newInstance();
        } catch (InvocationTargetException | InstantiationException | IllegalAccessException e) {
            Assertions.assertTrue(e instanceof InvocationTargetException);
            Assertions.assertTrue(((InvocationTargetException) e).getTargetException() instanceof IllegalStateException);
        }
    }

    @Test
    void NoNadContextException() {
        Assertions.assertThrows(NoNadContextException.class, NadContext::dumpClasses);
        Assertions.assertThrows(NoNadContextException.class, NadContext::dumpEnums);
    }
}