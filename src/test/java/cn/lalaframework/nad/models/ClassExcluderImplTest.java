package cn.lalaframework.nad.models;

import cn.lalaframework.nad.utils.ClassExcluder;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.aop.ClassFilter;

import java.util.Collections;

class ClassExcluderImplTest {
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
    void constructor() {
        ClassFilter filter = new ClassExcluder(Collections.singletonList("java.*"));
        Assertions.assertTrue(filter.matches(String.class));
        Assertions.assertFalse(filter.matches(NadResult.class));
    }
}