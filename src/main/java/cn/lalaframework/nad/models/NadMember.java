package cn.lalaframework.nad.models;

import org.springframework.lang.NonNull;

import java.util.List;

public class NadMember {
    @NonNull
    private final String name;
    @NonNull
    private final String type;
    @NonNull
    private final List<List<NadAnnotation>> annotations;

    public NadMember(@NonNull String name, @NonNull String type, @NonNull List<List<NadAnnotation>> annotations) {
        this.name = name;
        this.type = type;
        this.annotations = annotations;
    }

    @NonNull
    public List<List<NadAnnotation>> getAnnotations() {
        return annotations;
    }

    @NonNull
    public String getName() {
        return name;
    }

    @NonNull
    public String getType() {
        return type;
    }
}
