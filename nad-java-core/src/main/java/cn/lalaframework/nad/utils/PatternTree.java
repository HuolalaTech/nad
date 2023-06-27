package cn.lalaframework.nad.utils;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.util.Map;
import java.util.TreeMap;

/**
 * Build string patterns to a tree.
 */

class PatternTree {
    private boolean isWildcard = false;

    @Nullable
    private Map<Character, PatternTree> children = null;

    private void add(@NonNull String path, int offset) {
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

    private boolean match(@NonNull String path, int offset) {
        if (isWildcard) return true;
        if (offset >= path.length()) return true;
        char ch = path.charAt(offset);
        if (children == null) return false;
        PatternTree node = children.get(ch);
        if (node == null) return false;
        return node.match(path, offset + 1);
    }

    protected void add(@NonNull String path) {
        add(path, 0);
    }

    protected boolean match(@NonNull String path) {
        return match(path, 0);
    }
}
