package cn.lalaframework.nad.utils;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Set;
import java.util.TreeSet;

class PatternsUtilTest {
    Object getPatternsV2(Object info) throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
        Class<PatternsUtil> clz = PatternsUtil.class;
        Method method = clz.getDeclaredMethod("getPatternsV2", Object.class);
        method.setAccessible(true);
        return method.invoke(clz, info);
    }

    @Test
    void v2Null() throws InvocationTargetException, NoSuchMethodException, IllegalAccessException {
        Object res = getPatternsV2(new Object());
        Assertions.assertNull(res);
    }

    @Test
    void v2() throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
        class B {
            Set<String> getPatterns() {
                TreeSet<String> set = new TreeSet<>();
                set.add("hehe");
                return set;
            }
        }
        class A {
            B getPathPatternsCondition() {
                return new B();
            }
        }
        Object res = getPatternsV2(new A());
        Assertions.assertNotNull(res);
    }
}