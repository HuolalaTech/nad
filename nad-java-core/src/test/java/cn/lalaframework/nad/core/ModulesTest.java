package cn.lalaframework.nad.core;

import cn.lalaframework.nad.TestApplication;
import cn.lalaframework.nad.controllers.MyController;
import cn.lalaframework.nad.interfaces.NadAnnotation;
import cn.lalaframework.nad.interfaces.NadModule;
import cn.lalaframework.nad.interfaces.NadResult;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.util.Map;

@SpringBootTest(classes = TestApplication.class)
class ModulesTest {
    @Autowired
    private Core core;
    private NadResult res;

    @PostConstruct
    void init() {
        res = core.create();
    }

    @Test
    void getModules() {
        Assertions.assertNotNull(res);
        NadModule my = res.getModules().stream()
                .filter(i -> i.getName().equals(MyController.class.getName()))
                .findAny().orElse(null);
        Assertions.assertNotNull(my);
        NadAnnotation rc = my.getAnnotations().stream()
                .filter(i -> i.getType().equals(RestController.class.getName()))
                .findAny().orElse(null);
        Assertions.assertNotNull(rc);
        Map<String, Object> attrs = rc.getAttributes();
        Assertions.assertEquals("", attrs.get("value"));
    }
}