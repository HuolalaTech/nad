package cn.lalaframework.nad.utils;

import java.util.Map;
import java.util.TreeMap;

public class PatternTree {
    private boolean isWildcard = false;
    private Map<Character, PatternTree> children = null;

    private void add(String path, int offset) {
        if (isWildcard) return;
        if (offset >= path.length()) return;
        char ch = path.charAt(offset);
        if (ch == '*') {
            isWildcard = true;
            children = null;
        } else {
            if (children == null) children = new TreeMap<>();
            children.computeIfAbsent(ch, c -> new PatternTree()).add(path, offset + 1);
        }
    }

    private boolean match(String path, int offset) {
        if (isWildcard) return true;
        if (offset >= path.length()) return true;
        char ch = path.charAt(offset);
        PatternTree node = this.children.get(ch);
        if (node == null) return false;
        return node.match(path, offset + 1);
    }

    public void add(String path) {
        this.add(path, 0);
    }

    public boolean match(String path) {
        return this.match(path, 0);
    }
}
