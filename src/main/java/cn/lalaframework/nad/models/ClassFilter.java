package cn.lalaframework.nad.models;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ClassFilter {
    private final List<String> sList = new ArrayList<>();
    private final Set<String> uSet = new HashSet<>();

    public ClassFilter() {
    }

    public ClassFilter(List<String> rules) {
        rules.forEach(this::addRule);
    }

    /**
     * @param rule Either a full-qualified type name, such as `java.util.List`,
     *             or a pattern ending in "*",such as `java.lang.*`.
     */
    public void addRule(String rule) {
        if (rule == null) return;
        if (rule.endsWith("*")) {
            sList.add(rule.substring(0, rule.length() - 1));
        } else {
            uSet.add(rule);
        }
    }

    public boolean match(String name) {
        if (name == null) return false;
        if (uSet.contains(name)) return true;
        for (String item : sList) {
            if (name.startsWith(item)) return true;
        }
        return false;
    }
}
