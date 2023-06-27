package cn.lalaframework.nad.dto;

import org.springframework.lang.NonNull;

import java.util.List;

public interface NadDef {
    @NonNull
    String getName();

    @NonNull
    List<NadAnnotation> getAnnotations();
}
