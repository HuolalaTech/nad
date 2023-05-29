package cn.lalaframework.nad.models;

import org.springframework.lang.NonNull;

import java.util.List;

public class NadResult {
    @NonNull
    private final List<NadModule> modules;
    @NonNull
    private final List<NadRoute> routes;
    @NonNull
    private final List<NadClass> classes;
    @NonNull
    private final List<NadEnum> enums;

    public NadResult(@NonNull List<NadModule> modules, @NonNull List<NadRoute> routes, @NonNull List<NadClass> classes, @NonNull List<NadEnum> enums) {
        this.modules = modules;
        this.routes = routes;
        this.classes = classes;
        this.enums = enums;
    }

    @NonNull
    public List<NadModule> getModules() {
        return modules;
    }

    @NonNull
    public List<NadRoute> getRoutes() {
        return routes;
    }

    @NonNull
    public List<NadClass> getClasses() {
        return classes;
    }

    @NonNull
    public List<NadEnum> getEnums() {
        return enums;
    }
}
