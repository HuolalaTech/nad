package cn.lalaframework.nad.core;

import cn.lalaframework.nad.NadCore;
import cn.lalaframework.nad.TestApplication;
import cn.lalaframework.nad.controllers.dto.User;
import cn.lalaframework.nad.models.NadClass;
import cn.lalaframework.nad.models.NadMember;
import cn.lalaframework.nad.models.NadResult;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.PostConstruct;
import java.io.Serializable;
import java.util.List;

@SpringBootTest(classes = TestApplication.class)
class ClassesTest {
    @Autowired
    private NadCore core;
    private NadResult res;

    @PostConstruct
    void init() {
        res = core.create();
    }

    private NadClass getNadClass() {
        Assertions.assertNotNull(res);
        return res.getClasses().stream()
                .filter(i -> User.class.getTypeName().equals(i.getName()))
                .findAny().orElse(null);
    }

    @Test
    void getUser() {
        NadClass userClass = getNadClass();
        Assertions.assertNotNull(userClass);
        List<NadMember> members = userClass.getMembers();
        Assertions.assertEquals(2, members.size());

        NadMember m0 = members.get(0);
        Assertions.assertEquals("id", m0.getName());
        Assertions.assertEquals(Long.class.getTypeName(), m0.getType());
        Assertions.assertNotNull(m0.getAnnotations());

        NadMember m1 = members.get(1);
        Assertions.assertEquals("name", m1.getName());
        Assertions.assertEquals(String.class.getTypeName(), m1.getType());
        Assertions.assertNotNull(m1.getAnnotations());

        Assertions.assertEquals(Object.class.getTypeName(), userClass.getSuperclass());

        Assertions.assertNotNull(userClass.getTypeParameters());

        String iface = userClass.getInterfaces().stream()
                .filter(i -> i.equals(Serializable.class.getName()))
                .findAny().orElse(null);
        Assertions.assertNotNull(iface);
    }
}