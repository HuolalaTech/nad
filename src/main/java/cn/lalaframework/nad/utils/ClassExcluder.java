package cn.lalaframework.nad.utils;

import java.util.List;

public class ClassExcluder {
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

    public boolean match(String name) {
        return root.match(name);
    }
}
