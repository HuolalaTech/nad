package cn.lalaframework.nad.models;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

class NadMemberBuilderTest {
    @Test
    void build() {
        NadMemberBuilder nmb = new NadMemberBuilder("");
        Object nadMember = ReflectionTestUtils.invokeMethod(nmb, "build");
        Assertions.assertNotNull(nadMember);
        Object res = ReflectionTestUtils.invokeMethod(nadMember, "getType");
        Assertions.assertEquals("unknown", res);
    }
}