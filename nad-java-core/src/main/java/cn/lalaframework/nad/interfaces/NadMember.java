package cn.lalaframework.nad.interfaces;

import org.springframework.lang.NonNull;

import java.util.List;

public interface NadMember {
    @NonNull
    List<List<NadAnnotation>> getAnnotations();

    @NonNull
    String getName();

    @NonNull
    String getType();
}
