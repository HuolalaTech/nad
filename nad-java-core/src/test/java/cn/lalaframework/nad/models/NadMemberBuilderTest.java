package cn.lalaframework.nad.models;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;


class NadMemberBuilderTest {
    @Test
    void build() {
        NadMemberBuilder nmb = new NadMemberBuilder("");
        Object nadMember = ReflectionTestUtils.invokeMethod(nmb, "build");
        assertNotNull(nadMember);
        Object res = ReflectionTestUtils.invokeMethod(nadMember, "getType");
        assertEquals("unknown", res);
    }
}