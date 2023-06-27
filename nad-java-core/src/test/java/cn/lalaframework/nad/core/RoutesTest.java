package cn.lalaframework.nad.core;

import cn.lalaframework.nad.NadCore;
import cn.lalaframework.nad.TestApplication;
import cn.lalaframework.nad.controllers.MyController;
import cn.lalaframework.nad.controllers.dto.Role;
import cn.lalaframework.nad.controllers.dto.User;
import cn.lalaframework.nad.interfaces.NadAnnotation;
import cn.lalaframework.nad.interfaces.NadParameter;
import cn.lalaframework.nad.interfaces.NadResult;
import cn.lalaframework.nad.interfaces.NadRoute;
import cn.lalaframework.nad.models.NameValuePair;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;

import javax.annotation.PostConstruct;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

@SpringBootTest(classes = TestApplication.class)
class RoutesTest {
    @Autowired
    private NadCore core;
    private NadResult res;

    @PostConstruct
    void init() {
        res = core.create();
    }

    private NadRoute getNadRoute(@NonNull String name) {
        Assertions.assertNotNull(res);
        return res.getRoutes().stream().filter(i -> name.equals(i.getName())).findAny().orElse(null);
    }

    @Test
    void getRoutes() {
        String getUser1 = "getUser";
        NadRoute getUser = getNadRoute(getUser1);
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
    }

    @Test
    void ui() {
        NadRoute ui = getNadRoute("ui");
        Assertions.assertNotNull(ui);
        Assertions.assertNotNull(ui.getAnnotations());
        List<String> produces = ui.getProduces();
        Assertions.assertEquals(1, produces.size());
        Assertions.assertEquals(MediaType.TEXT_HTML_VALUE, produces.get(0));
    }

    @Test
    void setRole() {
        NadRoute setRole = getNadRoute("setRole");
        Assertions.assertLinesMatch(Collections.singletonList("POST"), setRole.getMethods());
        Assertions.assertNotNull(setRole);
        Assertions.assertEquals(1, setRole.getHeaders().size());
        NameValuePair header = setRole.getHeaders().get(0);
        Assertions.assertEquals("id", header.getName());
        Assertions.assertEquals("5", header.getValue());
        Assertions.assertFalse(header.isNegated());
        List<NadParameter> parameters = setRole.getParameters();
        Assertions.assertEquals(1, parameters.size());
        NadParameter role = parameters.get(0);
        Assertions.assertEquals("type", role.getName());
        Assertions.assertEquals(Role.class.getTypeName(), role.getType());
        List<NadAnnotation> an = role.getAnnotations();
        Assertions.assertNotNull(an);
    }

    @Test
    void upload() {
        NadRoute upload = getNadRoute("upload");
        Assertions.assertNotNull(upload);
        List<String> consumes = upload.getConsumes();
        Assertions.assertEquals(1, consumes.size());
        Assertions.assertEquals(MediaType.MULTIPART_FORM_DATA_VALUE, consumes.get(0));
    }

    @Test
    void getUsers() {
        NadRoute getUsers = getNadRoute("getUserList");
        Assertions.assertNotNull(getUsers);
        Assertions.assertNotNull(
                String.format("%s<%s>", List.class.getTypeName(), User.class.getTypeName()),
                getUsers.getReturnType());
    }
}