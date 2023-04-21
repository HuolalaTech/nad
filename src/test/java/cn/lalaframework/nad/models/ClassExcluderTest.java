package cn.lalaframework.nad.models;

import cn.lalaframework.nad.utils.ClassExcluder;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.Collections;

class ClassExcluderTest {
    @Test
    void basic() {
        ClassExcluder filter = new ClassExcluder();

        filter.addRule(Test.class.getTypeName());
        Assertions.assertTrue(filter.match(Test.class.getTypeName()));
        Assertions.assertFalse(filter.match(Assertions.class.getTypeName()));
        Assertions.assertFalse(filter.match(String.class.getTypeName()));

        filter.addRule("java.*");
        Assertions.assertTrue(filter.match(String.class.getTypeName()));
        Assertions.assertFalse(filter.match(ClassExcluder.class.getTypeName()));
    }

    @Test
    void constructor() {
        ClassExcluder filter = new ClassExcluder(Collections.singletonList("java.*"));
        Assertions.assertTrue(filter.match(String.class.getTypeName()));
        Assertions.assertFalse(filter.match(ClassExcluder.class.getTypeName()));
    }
}