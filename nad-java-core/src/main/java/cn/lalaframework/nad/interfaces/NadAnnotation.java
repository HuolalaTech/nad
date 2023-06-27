package cn.lalaframework.nad.interfaces;

import org.springframework.lang.NonNull;

import java.util.Map;

public interface NadAnnotation {
    @NonNull
    String getType();

    @NonNull
    Map<String, Object> getAttributes();
}
