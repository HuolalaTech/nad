package cn.lalaframework.nad.core;

import cn.lalaframework.nad.TestApplication;
import cn.lalaframework.nad.controllers.MyController;
import cn.lalaframework.nad.controllers.dto.Role;
import cn.lalaframework.nad.controllers.dto.User;
import cn.lalaframework.nad.interfaces.NadAnnotation;
import cn.lalaframework.nad.interfaces.NadParameter;
import cn.lalaframework.nad.interfaces.NadResult;
import cn.lalaframework.nad.interfaces.NadRoute;
import cn.lalaframework.nad.models.NameValuePair;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;

import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = TestApplication.class)
class RoutesTest {
    @Autowired
    private Core core;

    private NadRoute getNadRoute(@NonNull String name) {
        NadResult res = core.create();
        assertNotNull(res);
        return res.getRoutes().stream().filter(i -> name.equals(i.getName())).findAny().orElse(null);
    }

    @Test
    void getRoutes() {
        String getUser1 = "getUser";
        NadRoute getUser = getNadRoute(getUser1);
        assertNotNull(getUser);
        List<String> patterns = getUser.getPatterns();
        assertEquals(1, patterns.size());
        assertEquals("/getUser", patterns.iterator().next());
        assertEquals(MyController.class.getTypeName(), getUser.getBean());
        assertEquals(User.class.getTypeName(), getUser.getReturnType());
        List<NadParameter> parameters = getUser.getParameters();
        Iterator<NadParameter> pi = parameters.iterator();
        NadParameter firstParameter = pi.next();
        NadParameter secondParameter = pi.next();
        assertEquals("name", firstParameter.getName());
        assertEquals("userType", secondParameter.getName());
        assertEquals(0, getUser.getModifiers());
        assertNotNull(getUser.getTypeParameters());
    }

    @Test
    void ui() {
        NadRoute ui = getNadRoute("ui");
        assertNotNull(ui);
        assertNotNull(ui.getAnnotations());
        List<String> produces = ui.getProduces();
        assertEquals(1, produces.size());
        assertEquals(MediaType.TEXT_HTML_VALUE, produces.get(0));
        assertTrue(ui.getCustomFlags().isEmpty());
    }

    @Test
    void setRole() {
        NadRoute setRole = getNadRoute("setRole");
        assertLinesMatch(Collections.singletonList("POST"), setRole.getMethods());
        assertNotNull(setRole);
        assertEquals(1, setRole.getParameters().size());
        assertNotNull(setRole.getTypeParameters());
        assertEquals(1, setRole.getHeaders().size());
        NameValuePair header = setRole.getHeaders().get(0);
        assertEquals("id", header.getName());
        assertEquals("5", header.getValue());
        assertFalse(header.isNegated());
        List<NadParameter> parameters = setRole.getParameters();
        assertEquals(1, parameters.size());
        NadParameter role = parameters.get(0);
        assertEquals("type", role.getName());
        assertEquals(Role.class.getTypeName(), role.getType());
        List<NadAnnotation> an = role.getAnnotations();
        assertNotNull(an);
    }

    @Test
    void upload() {
        NadRoute upload = getNadRoute("upload");
        assertNotNull(upload);
        List<String> consumes = upload.getConsumes();
        assertEquals(1, consumes.size());
        assertEquals(MediaType.MULTIPART_FORM_DATA_VALUE, consumes.get(0));
    }

    @Test
    void getUsers() {
        NadRoute getUsers = getNadRoute("getUserList");
        assertNotNull(getUsers);
        assertNotNull(
                String.format("%s<%s>", List.class.getTypeName(), User.class.getTypeName()),
                getUsers.getReturnType());
    }
}