package cn.lalaframework.nad.utils;

import cn.lalaframework.nad.models.NadResult;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.aop.ClassFilter;

import java.util.Collections;

class ClassExcluderTest {
    @Test
    void basic() {
        ClassExcluder filter = new ClassExcluder();

        filter.addRule(Test.class.getTypeName());
        Assertions.assertTrue(filter.matches(Test.class));
        Assertions.assertFalse(filter.matches(Assertions.class));
        Assertions.assertFalse(filter.matches(String.class));

        filter.addRule("java.*");
        Assertions.assertTrue(filter.matches(String.class));
        Assertions.assertFalse(filter.matches(NadResult.class));
    }

    @Test
    void over() {
        ClassExcluder filter = new ClassExcluder();
        filter.addRule("java");
        Assertions.assertFalse(filter.matches(String.class));
    }

    @Test
    void constructor() {
        ClassFilter filter = new ClassExcluder(Collections.singletonList("java.*"));
        Assertions.assertTrue(filter.matches(String.class));
        Assertions.assertFalse(filter.matches(NadResult.class));
    }
}