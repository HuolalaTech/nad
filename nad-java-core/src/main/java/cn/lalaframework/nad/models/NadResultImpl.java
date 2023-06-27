package cn.lalaframework.nad.models;

import cn.lalaframework.nad.interfaces.*;
import org.springframework.lang.NonNull;

import java.util.List;

public class NadResultImpl implements NadResult {
    @NonNull
    private final List<NadModule> modules;
    @NonNull
    private final List<NadRoute> routes;
    @NonNull
    private final List<NadClass> classes;
    @NonNull
    private final List<NadEnum> enums;

    public NadResultImpl(
            @NonNull List<NadModule> modules,
            @NonNull List<NadRoute> routes,
            @NonNull List<NadClass> classes,
            @NonNull List<NadEnum> enums
    ) {
        this.modules = modules;
        this.routes = routes;
        this.classes = classes;
        this.enums = enums;
    }

    @Override
    @NonNull
    public List<NadModule> getModules() {
        return modules;
    }

    @Override
    @NonNull
    public List<NadRoute> getRoutes() {
        return routes;
    }

    @Override
    @NonNull
    public List<NadClass> getClasses() {
        return classes;
    }

    @Override
    @NonNull
    public List<NadEnum> getEnums() {
        return enums;
    }
}
