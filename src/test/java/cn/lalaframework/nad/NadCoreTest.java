package cn.lalaframework.nad;

import cn.lalaframework.nad.controllers.MyController;
import cn.lalaframework.nad.models.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Iterator;
import java.util.List;

@SpringBootTest(classes = TestApplication.class)
class NadCoreTest {
    @Autowired
    private NadCore core;

    @Test
    void getModules() {
        NadResult res = core.create();
        Assertions.assertNotNull(res);
        NadModule my = res.getModules().stream()
                .filter(i -> i.getName().equals(MyController.class.getName()))
                .findAny().orElse(null);
        Assertions.assertNotNull(my);
        Assertions.assertEquals(1, my.getAnnotations().size());
    }

    @Test
    void getRoutes() {
        NadResult res = core.create();
        Assertions.assertNotNull(res);
        NadRoute route = res.getRoutes().stream()
                .filter(i -> "getUser" .equals(i.getName())).findAny().orElse(null);
        Assertions.assertNotNull(route);
        List<String> patterns = route.getPatterns();
        Assertions.assertEquals(1, patterns.size());
        Assertions.assertEquals("/getUser", patterns.iterator().next());
        Assertions.assertEquals(MyController.class.getTypeName(), route.getBean());
        Assertions.assertEquals(User.class.getTypeName(), route.getReturnType());
        List<NadParameter> parameters = route.getParameters();
        Iterator<NadParameter> pi = parameters.iterator();
        NadParameter firstParameter = pi.next();
        NadParameter secondParameter = pi.next();
        Assertions.assertEquals("name", firstParameter.getName());
        Assertions.assertEquals("userType", secondParameter.getName());
    }

    @Test
    void getClasses() {
        NadResult res = core.create();
        Assertions.assertNotNull(res);
        NadClass nc = res.getClasses().stream()
                .filter(i -> User.class.getTypeName().equals(i.getName()))
                .findAny().orElse(null);
        Assertions.assertNotNull(nc);
        List<NadMember> members = nc.getMembers();
        Assertions.assertEquals(2, members.size());
    }

    @Test
    void getEnums() {
        NadResult res = core.create();
        Assertions.assertNotNull(res);
        NadEnum ne = res.getEnums().stream()
                .filter(i -> i.getName().endsWith(Role.class.getTypeName()))
                .findAny().orElse(null);
        Assertions.assertNotNull(ne);
        List<NadEnumConstant<?>> constants = ne.getConstants();
        Assertions.assertEquals(2, constants.size());

        Assertions.assertEquals(Role.ADMIN.name(), constants.get(0).getName());
        Assertions.assertEquals(Role.ADMIN.getDescription(), constants.get(0).getProperties().get("description"));
        Assertions.assertEquals(Role.ADMIN.getCode(), constants.get(0).getProperties().get("code"));

        Assertions.assertEquals(Role.DEV.name(), constants.get(1).getName());
        Assertions.assertEquals(Role.DEV.getDescription(), constants.get(1).getProperties().get("description"));
        Assertions.assertEquals(Role.DEV.getCode(), constants.get(1).getProperties().get("code"));
    }
}