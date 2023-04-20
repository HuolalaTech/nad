package cn.lalaframework.nad.models;

import cn.lalaframework.nad.utils.PatternTree;

import java.util.List;

public class ClassFilter {
    private final PatternTree root;

    public ClassFilter() {
        root = new PatternTree();
    }

    public ClassFilter(List<String> rules) {
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
