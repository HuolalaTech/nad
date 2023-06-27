package cn.lalaframework.nad.core;

import cn.lalaframework.nad.NadCore;
import cn.lalaframework.nad.TestApplication;
import cn.lalaframework.nad.controllers.dto.User;
import cn.lalaframework.nad.dto.NadClass;
import cn.lalaframework.nad.dto.NadMember;
import cn.lalaframework.nad.dto.NadResult;
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

    private static void assertMember(List<NadMember> members, String id, String TypeName) {
        NadMember member = members.stream().filter(i -> id.equals(i.getName())).findFirst().orElse(null);
        Assertions.assertNotNull(member);
        Assertions.assertEquals(TypeName, member.getType());
        Assertions.assertNotNull(member.getAnnotations());
    }

    @Test
    void getUser() {
        NadClass userClass = getNadClass();
        Assertions.assertNotNull(userClass);
        List<NadMember> members = userClass.getMembers();
        Assertions.assertEquals(5, members.size());

        assertMember(members, "id", Long.class.getTypeName());
        assertMember(members, "name", String.class.getTypeName());
        assertMember(members, "nickName", String.class.getTypeName());
        assertMember(members, "active", boolean.class.getTypeName());
        assertMember(members, "enabled", Boolean.class.getTypeName());

        Assertions.assertEquals(Object.class.getTypeName(), userClass.getSuperclass());

        Assertions.assertNotNull(userClass.getTypeParameters());

        String iface = userClass.getInterfaces().stream()
                .filter(i -> i.equals(Serializable.class.getName()))
                .findAny().orElse(null);
        Assertions.assertNotNull(iface);
    }
}