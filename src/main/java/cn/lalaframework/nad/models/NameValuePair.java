package cn.lalaframework.nad.models;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.web.servlet.mvc.condition.NameValueExpression;

public class NameValuePair implements NameValueExpression<String> {
    @NonNull
    private final String name;
    @Nullable
    private final String value;

    private final boolean isNegated;

    public NameValuePair(@NonNull NameValueExpression<String> expression) {
        this.name = expression.getName();
        this.value = expression.getValue();
        this.isNegated = expression.isNegated();
    }

    @NonNull
    public String getName() {
        return name;
    }

    @Nullable
    public String getValue() {
        return value;
    }

    @Override
    public boolean isNegated() {
        return this.isNegated;
    }
}
