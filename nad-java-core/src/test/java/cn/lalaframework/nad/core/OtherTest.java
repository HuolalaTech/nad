package cn.lalaframework.nad.core;

import cn.lalaframework.nad.NadCore;
import cn.lalaframework.nad.TestApplication;
import cn.lalaframework.nad.dto.NadResult;
import cn.lalaframework.nad.utils.ClassExcluder;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = TestApplication.class)
class OtherTest {
    @Autowired
    private NadCore core;


    @Test
    void getRoutes() {
        ClassExcluder ce = new ClassExcluder();
        ce.addRule("*");
        NadResult res = core.create(ce);
        Assertions.assertEquals(0, res.getClasses().size());
    }

}