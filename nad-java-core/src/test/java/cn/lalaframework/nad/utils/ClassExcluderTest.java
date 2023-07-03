package cn.lalaframework.nad.utils;

import cn.lalaframework.nad.interfaces.NadResult;
import org.junit.jupiter.api.Test;
import org.springframework.aop.ClassFilter;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ClassExcluderTest {
    @Test
    void basic() {
        ClassExcluder filter = new ClassExcluder();

        filter.addRule(Test.class.getTypeName());
        assertTrue(filter.matches(Test.class));
        assertFalse(filter.matches(ClassFilter.class));
        assertFalse(filter.matches(String.class));

        filter.addRule("java.*");
        assertTrue(filter.matches(String.class));
        assertFalse(filter.matches(NadResult.class));

        assertFalse(filter.matches(null));
    }

    @Test
    void over() {
        ClassExcluder filter = new ClassExcluder();
        filter.addRule("java");
        assertFalse(filter.matches(String.class));
    }

    @Test
    void constructor() {
        ClassFilter filter = new ClassExcluder(Collections.singletonList("java.*"));
        assertTrue(filter.matches(String.class));
        assertFalse(filter.matches(NadResult.class));
    }
}