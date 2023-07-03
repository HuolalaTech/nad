package cn.lalaframework.nad.core;

import cn.lalaframework.nad.TestApplication;
import cn.lalaframework.nad.controllers.dto.Role;
import cn.lalaframework.nad.controllers.dto.User;
import cn.lalaframework.nad.interfaces.NadDef;
import cn.lalaframework.nad.interfaces.NadResult;
import cn.lalaframework.nad.utils.ClassExcluder;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;

@SpringBootTest(classes = TestApplication.class)
class FilterTest {
    @Autowired
    private Core core;

    private static ClassExcluder getBasicClassExcluder(String... args) {
        ClassExcluder filter = new ClassExcluder();
        filter.addRule("java.*");
        filter.addRule("javax.*");
        filter.addRule("org.*");
        Arrays.stream(args).forEach(filter::addRule);
        return filter;
    }

    private static <T extends NadDef> NadDef getNadClass(List<T> classes, Class<?> clz) {
        String name = clz.getTypeName();
        return classes
                .stream()
                .filter(i -> name.equals(i.getName()))
                .findAny()
                .orElse(null);
    }

    @Test
    void filterEnum() {
        ClassExcluder filter = getBasicClassExcluder(Role.class.getTypeName());
        NadResult res = core.create(filter);
        Assertions.assertNotNull(res);
        NadDef role = getNadClass(res.getEnums(), Role.class);
        NadDef user = getNadClass(res.getClasses(), User.class);
        Assertions.assertNotNull(user);
        Assertions.assertNull(role);
    }

    @Test
    void filterClazz() {
        ClassExcluder filter = getBasicClassExcluder(User.class.getTypeName());
        NadResult res = core.create(filter);
        Assertions.assertNotNull(res);
        NadDef role = getNadClass(res.getEnums(), Role.class);
        NadDef user = getNadClass(res.getClasses(), User.class);
        Assertions.assertNotNull(role);
        Assertions.assertNull(user);
    }

    @Test
    void filterAll() {
        ClassExcluder filter = getBasicClassExcluder("*");
        filter.addRule(User.class.getTypeName());
        NadResult res = core.create(filter);
        Assertions.assertNotNull(res);
        NadDef role = getNadClass(res.getEnums(), Role.class);
        NadDef user = getNadClass(res.getClasses(), User.class);
        Assertions.assertNull(role);
        Assertions.assertNull(user);
    }
}