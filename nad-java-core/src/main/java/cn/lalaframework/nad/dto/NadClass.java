package cn.lalaframework.nad.dto;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.util.List;

public interface NadClass extends NadDef {
    @Nullable
    String getSuperclass();

    @NonNull
    List<NadMember> getMembers();

    @NonNull
    List<String> getTypeParameters();

    @NonNull
    List<String> getInterfaces();
}
