package cn.lalaframework.nad.utils.impls;

import cn.lalaframework.nad.utils.ClassExcluder;
import cn.lalaframework.nad.utils.PatternTree;

import java.util.List;

public class ClassExcluderImpl implements ClassExcluder {
    private final PatternTree root;

    public ClassExcluderImpl() {
        root = new PatternTree();
    }

    public ClassExcluderImpl(List<String> rules) {
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
    public boolean match(String name) {
        return root.match(name);
    }
}
