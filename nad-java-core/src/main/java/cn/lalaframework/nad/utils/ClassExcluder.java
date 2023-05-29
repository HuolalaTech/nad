package cn.lalaframework.nad.utils;

import org.springframework.aop.ClassFilter;

import java.util.List;

public class ClassExcluder implements ClassFilter {
    private final PatternTree root;

    public ClassExcluder() {
        root = new PatternTree();
    }

    public ClassExcluder(List<String> rules) {
        this();
        rules.forEach(this::addRule);
    }

    /**
     * @param rule Either a full-qualified type name, such as `java.util.List`,
     *             or a pattern ending in "*",such as `java.lang.*`.
     */
    public void addRule(String rule) {
        root.add(rule);
    }

    @Override
    public boolean matches(Class<?> clz) {
        return root.match(clz.getTypeName());
    }
}
