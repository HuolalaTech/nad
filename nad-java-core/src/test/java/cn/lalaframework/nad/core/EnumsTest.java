package cn.lalaframework.nad.core;

import cn.lalaframework.nad.TestApplication;
import cn.lalaframework.nad.controllers.dto.Role;
import cn.lalaframework.nad.interfaces.NadEnum;
import cn.lalaframework.nad.interfaces.NadEnumConstant;
import cn.lalaframework.nad.interfaces.NadResult;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.PostConstruct;
import java.util.List;

@SpringBootTest(classes = TestApplication.class)
class EnumsTest {
    @Autowired
    private Core core;
    private NadResult res;

    @PostConstruct
    void init() {
        res = core.create();
    }


    @Test
    void getEnums() {
        Assertions.assertNotNull(res);
        NadEnum ne = res.getEnums().stream()
                .filter(i -> i.getName().endsWith(Role.class.getTypeName()))
                .findAny().orElse(null);
        Assertions.assertNotNull(ne);
        List<NadEnumConstant> constants = ne.getConstants();
        Assertions.assertEquals(2, constants.size());

        NadEnumConstant c0 = constants.get(0);
        Assertions.assertEquals(Role.ADMIN, c0.getValue());
        Assertions.assertEquals(Role.ADMIN.name(), c0.getName());
        Assertions.assertEquals(Role.ADMIN.getDescription(), c0.getProperties().get("description"));
        Assertions.assertEquals(Role.ADMIN.getCode(), c0.getProperties().get("code"));
        Assertions.assertNotNull(c0.getAnnotations());

        NadEnumConstant c1 = constants.get(1);
        Assertions.assertEquals(Role.DEV, c1.getValue());
        Assertions.assertEquals(Role.DEV.name(), c1.getName());
        Assertions.assertEquals(Role.DEV.getDescription(), c1.getProperties().get("description"));
        Assertions.assertEquals(Role.DEV.getCode(), c1.getProperties().get("code"));
        Assertions.assertNotNull(c1.getAnnotations());
    }
}