package cn.lalaframework.nad.utils;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.web.servlet.mvc.condition.PatternsRequestCondition;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.util.pattern.PathPattern;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

public class PatternsUtil {
    private PatternsUtil() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * For spring-boot < 2.6.0
     *
     * @param info RequestMappingInfo
     * @return pattern list
     */
    @Nullable
    private static List<String> getPatternsV1(@Nullable Object info) {
        Object pc = Reflection.invokeMethod(info, "getPatternsCondition");
        if (!(pc instanceof PatternsRequestCondition)) return null;
        Object set = Reflection.invokeMethod(pc, "getPatterns");
        if (!(set instanceof Set)) return null;
        return ((Set<?>) set).stream()
                .map(i -> i instanceof String ? ((String) i) : null)
                .filter(Objects::nonNull).collect(Collectors.toList());
    }

    /**
     * For spring-boot >= 2.6.0
     *
     * @param info RequestMappingInfo
     * @return pattern list
     */
    @Nullable
    private static List<String> getPatternsV2(@Nullable Object info) {
        Object pc = Reflection.invokeMethod(info, "getPathPatternsCondition");
        if (pc == null) return null;
        Object set = Reflection.invokeMethod(pc, "getPatterns");
        if (!(set instanceof Set)) return null;
        return ((Set<?>) set).stream()
                .map(i -> i instanceof PathPattern ? ((PathPattern) i).getPatternString() : null)
                .filter(Objects::nonNull).collect(Collectors.toList());
    }

    /**
     * Get active patterns from RequestMappingInfo object.
     *
     * @param info RequestMappingInfo
     * @return active pattern list
     */
    @NonNull
    public static List<String> getActivePatterns(@NonNull RequestMappingInfo info) {
        List<String> list = getPatternsV2(info);
        if (list == null) list = getPatternsV1(info);
        if (list == null) list = new ArrayList<>();
        return list;
    }
}
