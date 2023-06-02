package cn.lalaframework.nad.models;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class NadMemberBuilderTest {
    @Test
    void build() {
        NadMemberBuilder nmb = new NadMemberBuilder("");
        Assertions.assertEquals("unknown", nmb.build().getType());
    }
}