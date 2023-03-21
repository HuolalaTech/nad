package cn.lalaframework.nad.models;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.web.servlet.mvc.condition.NameValueExpression;

public class NameValuePair {
    @NonNull
    private final String name;
    @Nullable
    private final String value;

    public NameValuePair(NameValueExpression<String> expression) {
        this(expression.getName(), expression.getValue());
    }

    public NameValuePair(@NonNull String name, String value) {
        this.name = name;
        this.value = value;
    }

    @NonNull
    public String getName() {
        return name;
    }

    @Nullable
    public String getValue() {
        return value;
    }
}
