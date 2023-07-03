package cn.lalaframework.nad.core;

import cn.lalaframework.nad.TestApplication;
import cn.lalaframework.nad.controllers.dto.Role;
import cn.lalaframework.nad.interfaces.NadEnum;
import cn.lalaframework.nad.interfaces.NadEnumConstant;
import cn.lalaframework.nad.interfaces.NadResult;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.PostConstruct;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

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
        assertNotNull(res);
        NadEnum ne = res.getEnums().stream()
                .filter(i -> i.getName().endsWith(Role.class.getTypeName()))
                .findAny().orElse(null);
        assertNotNull(ne);
        List<NadEnumConstant> constants = ne.getConstants();
        assertEquals(2, constants.size());

        NadEnumConstant c0 = constants.get(0);
        assertEquals(Role.ADMIN, c0.getValue());
        assertEquals(Role.ADMIN.name(), c0.getName());
        assertEquals(Role.ADMIN.getDescription(), c0.getProperties().get("description"));
        assertEquals(Role.ADMIN.getCode(), c0.getProperties().get("code"));
        assertNotNull(c0.getAnnotations());

        NadEnumConstant c1 = constants.get(1);
        assertEquals(Role.DEV, c1.getValue());
        assertEquals(Role.DEV.name(), c1.getName());
        assertEquals(Role.DEV.getDescription(), c1.getProperties().get("description"));
        assertEquals(Role.DEV.getCode(), c1.getProperties().get("code"));
        assertNotNull(c1.getAnnotations());
    }
}