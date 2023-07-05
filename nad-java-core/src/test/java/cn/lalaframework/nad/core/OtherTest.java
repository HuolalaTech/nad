package cn.lalaframework.nad.core;

import cn.lalaframework.nad.TestApplication;
import cn.lalaframework.nad.interfaces.NadResult;
import cn.lalaframework.nad.utils.ClassExcluder;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(classes = TestApplication.class)
class OtherTest {
    @Autowired
    private Core core;

    @Test
    void getRoutes() {
        ClassExcluder ce = new ClassExcluder();
        ce.addRule("*");
        NadResult res = core.create(ce);
        assertEquals(0, res.getClasses().size());
    }
}