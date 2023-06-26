package cn.lalaframework.nad.models;

import org.springframework.lang.NonNull;

import java.util.List;

public interface NadResult {
    @NonNull
    List<NadModule> getModules();

    @NonNull
    List<NadRoute> getRoutes();

    @NonNull
    List<NadClass> getClasses();

    @NonNull
    List<NadEnum> getEnums();
}
