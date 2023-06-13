package cn.lalaframework.nad.models;

import org.springframework.lang.NonNull;

import java.util.List;

public interface NadRouteHandler {
    @NonNull
    String getName();

    @NonNull
    String getBean();

    @NonNull
    List<NadParameter> getParameters();

    @NonNull
    List<NadAnnotation> getAnnotations();

    @NonNull
    String getReturnType();
}
