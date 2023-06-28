package cn.lalaframework.nad.models;

import cn.lalaframework.nad.interfaces.NadAnnotation;
import cn.lalaframework.nad.interfaces.NadMember;
import org.springframework.lang.NonNull;

import java.util.List;

public class NadMemberImpl implements NadMember {
    @NonNull
    private final String name;
    @NonNull
    private final String type;
    @NonNull
    private final List<List<NadAnnotation>> annotations;

    public NadMemberImpl(@NonNull String name, @NonNull String type, @NonNull List<List<NadAnnotation>> annotations) {
        this.name = name;
        this.type = type;
        this.annotations = annotations;
    }

    @Override
    @NonNull
    public List<List<NadAnnotation>> getAnnotations() {
        return annotations;
    }

    @Override
    @NonNull
    public String getName() {
        return name;
    }

    @Override
    @NonNull
    public String getType() {
        return type;
    }
}
