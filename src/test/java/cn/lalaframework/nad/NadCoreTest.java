package cn.lalaframework.nad;

import cn.lalaframework.nad.controllers.MyController;
import cn.lalaframework.nad.controllers.dto.Role;
import cn.lalaframework.nad.controllers.dto.User;
import cn.lalaframework.nad.models.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RestController;

import java.io.Serializable;
import java.util.Iterator;
import java.util.List;

@SpringBootTest(classes = TestApplication.class)
class NadCoreTest {
    @Autowired
    private NadCore core;

    @Test
    void getRoutes() {
        NadResult res = core.create();
        Assertions.assertNotNull(res);

        // getUser
        NadRoute getUser = res.getRoutes().stream()
                .filter(i -> "getUser".equals(i.getName())).findAny().orElse(null);
        Assertions.assertNotNull(getUser);
        List<String> patterns = getUser.getPatterns();
        Assertions.assertEquals(1, patterns.size());
        Assertions.assertEquals("/getUser", patterns.iterator().next());
        Assertions.assertEquals(MyController.class.getTypeName(), getUser.getBean());
        Assertions.assertEquals(User.class.getTypeName(), getUser.getReturnType());
        List<NadParameter> parameters = getUser.getParameters();
        Iterator<NadParameter> pi = parameters.iterator();
        NadParameter firstParameter = pi.next();
        NadParameter secondParameter = pi.next();
        Assertions.assertEquals("name", firstParameter.getName());
        Assertions.assertEquals("userType", secondParameter.getName());

        // upload
        NadRoute upload = res.getRoutes().stream()
                .filter(i -> "upload".equals(i.getName())).findAny().orElse(null);
        Assertions.assertNotNull(upload);
        List<String> consumes = upload.getConsumes();
        Assertions.assertEquals(1, consumes.size());
        Assertions.assertEquals(MediaType.MULTIPART_FORM_DATA_VALUE, consumes.get(0));

        // ui
        NadRoute ui = res.getRoutes().stream()
                .filter(i -> "ui".equals(i.getName())).findAny().orElse(null);
        Assertions.assertNotNull(ui);
        List<String> produces = ui.getProduces();
        Assertions.assertEquals(1, produces.size());
        Assertions.assertEquals(MediaType.TEXT_HTML_VALUE, produces.get(0));
    }

    @Test
    void getClasses() {
        NadResult res = core.create();
        Assertions.assertNotNull(res);
        NadClass userClass = res.getClasses().stream()
                .filter(i -> User.class.getTypeName().equals(i.getName()))
                .findAny().orElse(null);
        Assertions.assertNotNull(userClass);
        List<NadMember> members = userClass.getMembers();
        Assertions.assertEquals(2, members.size());
        String iface = userClass.getInterfaces().stream()
                .filter(i -> i.equals(Serializable.class.getName()))
                .findAny().orElse(null);
        Assertions.assertNotNull(iface);
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

    @Test
    void getModules() {
        NadResult res = core.create();
        Assertions.assertNotNull(res);
        NadModule my = res.getModules().stream()
                .filter(i -> i.getName().equals(MyController.class.getName()))
                .findAny().orElse(null);
        Assertions.assertNotNull(my);
        NadAnnotation rc = my.getAnnotations().stream()
                .filter(i -> i.getType().equals(RestController.class.getName()))
                .findAny().orElse(null);
        Assertions.assertNotNull(rc);
    }
}