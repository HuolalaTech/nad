package cn.lalaframework.nad.core;

import cn.lalaframework.nad.TestApplication;
import cn.lalaframework.nad.controllers.dto.User;
import cn.lalaframework.nad.interfaces.NadClass;
import cn.lalaframework.nad.interfaces.NadMember;
import cn.lalaframework.nad.interfaces.NadResult;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.Serializable;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(classes = TestApplication.class)
class ClassesTest {
    @Autowired
    private Core core;

    private static void assertMember(List<NadMember> members, String id, String TypeName) {
        NadMember member = members.stream().filter(i -> id.equals(i.getName())).findFirst().orElse(null);
        assertNotNull(member);
        assertEquals(TypeName, member.getType());
        assertNotNull(member.getAnnotations());
    }

    private NadClass getNadClass() {
        NadResult res = core.create();
        return res.getClasses().stream()
                .filter(i -> User.class.getTypeName().equals(i.getName()))
                .findAny().orElse(null);
    }

    @Test
    void getUser() {
        NadClass userClass = getNadClass();
        assertNotNull(userClass);
        List<NadMember> members = userClass.getMembers();
        assertEquals(5, members.size());

        assertMember(members, "id", Long.class.getTypeName());
        assertMember(members, "name", String.class.getTypeName());
        assertMember(members, "nickName", String.class.getTypeName());
        assertMember(members, "active", boolean.class.getTypeName());
        assertMember(members, "enabled", Boolean.class.getTypeName());

        assertEquals(Object.class.getTypeName(), userClass.getSuperclass());

        assertNotNull(userClass.getImportantMethods());
        assertNotNull(userClass.getInnerClasses());

        assertNotNull(userClass.getTypeParameters());

        String iface = userClass.getInterfaces().stream()
                .filter(i -> i.equals(Serializable.class.getName()))
                .findAny().orElse(null);
        assertNotNull(iface);
    }
}