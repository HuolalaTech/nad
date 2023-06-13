package cn.lalaframework.nad.utils;

import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.platform.commons.util.ReflectionUtils;
import org.springframework.web.util.pattern.PathPatternParser;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

class PatternsUtilTest {
    private static Object invoke(String getPatternsV1, Object info) {
        try {
            Class<PatternsUtil> clz = PatternsUtil.class;
            Method method = clz.getDeclaredMethod(getPatternsV1, Object.class);
            method.setAccessible(true);
            return method.invoke(clz, info);
        } catch (NoSuchMethodException | InvocationTargetException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }

    }

    Object getPatternsV2(Object info) {
        return invoke("getPatternsV2", info);
    }

    Object getPatternsV1(Object info) {
        return invoke("getPatternsV1", info);
    }

    @Test
    void v1() {
        Assertions.assertNull(getPatternsV1(new Object()));
        RequestMappingInfo info = new RequestMappingInfo();
        Assertions.assertNull(getPatternsV1(info));
        info.patterns = new PatternsRequestCondition();
        Assertions.assertNull(getPatternsV1(info));
        info.patterns.patterns = new LinkedHashSet<>();
        info.patterns.patterns.add("/test");
        info.patterns.patterns.add("/user/{id}");
        info.patterns.patterns.add(123);
        Assertions.assertNotNull(getPatternsV1(info));
        // getActivePatterns
        List<String> list = PatternsUtil.getActivePatterns(info);
        Assertions.assertIterableEquals(Lists.list("/test", "/user/{id}"), list);
    }

    @Test
    void v2() {
        Assertions.assertNull(getPatternsV2(new Object()));
        RequestMappingInfo info = new RequestMappingInfo();
        Assertions.assertNull(getPatternsV2(info));
        info.pathPatterns = new PatternsRequestCondition();
        Assertions.assertNull(getPatternsV2(info));
        info.pathPatterns.patterns = new LinkedHashSet<>();
        PathPatternParser ppp = new PathPatternParser();
        info.pathPatterns.patterns.add(ppp.parse("/test"));
        info.pathPatterns.patterns.add(ppp.parse("/user/{id}"));
        info.pathPatterns.patterns.add("bad string object");
        Assertions.assertNotNull(getPatternsV2(info));
        // getActivePatterns
        List<String> list = PatternsUtil.getActivePatterns(info);
        Assertions.assertIterableEquals(Lists.list("/test", "/user/{id}"), list);
    }

    @Test
    void getNull() {
        Assertions.assertNotNull(PatternsUtil.getActivePatterns(null));
    }

    @Test
    void construct() {
        Assertions.assertThrows(
                IllegalStateException.class,
                () -> ReflectionUtils.newInstance(PatternsUtil.class)
        );
    }

    static class RequestMappingInfo {

        public PatternsRequestCondition pathPatterns;

        public PatternsRequestCondition patterns;

        PatternsRequestCondition getPathPatternsCondition() {
            return pathPatterns;
        }

        PatternsRequestCondition getPatternsCondition() {
            return patterns;
        }
    }

    static class PatternsRequestCondition {
        public Set<Object> patterns;

        Set<Object> getPatterns() {
            return patterns;
        }
    }
}