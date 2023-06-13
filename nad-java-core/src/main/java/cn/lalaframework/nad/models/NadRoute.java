package cn.lalaframework.nad.models;

import org.springframework.lang.NonNull;

import java.util.List;
import java.util.stream.Collectors;

public class NadRoute {
    @NonNull
    private final String name;
    @NonNull
    private final String bean;
    @NonNull
    private final List<String> methods;
    @NonNull
    private final List<String> patterns;
    @NonNull
    private final List<NameValuePair> headers;
    @NonNull
    private final List<NadParameter> parameters;
    @NonNull
    private final List<NadAnnotation> annotations;
    @NonNull
    private final String returnType;
    @NonNull
    private final List<String> consumes;
    @NonNull
    private final List<String> produces;

    public NadRoute(@NonNull NadRouteInfo info, @NonNull NadRouteHandler method) {
        name = method.getName();
        bean = method.getBean();
        parameters = method.getParameters();
        annotations = method.getAnnotations();
        returnType = method.getReturnType();

        methods = info.getMethods();
        headers = info.getHeaders();
        consumes = info.getConsumes();
        produces = info.getProduces();
        patterns = info.getPatterns();
    }

    /**
     * There are two advantages for this sort key:
     * 1. Methods on the same controller will be grouped together, because the package name is included.
     * 2. There is no conflict even if the methods are overloaded, because the parameters are included.
     */
    @NonNull
    public static String getSortKey(@NonNull NadRoute route) {
        return String.format(
                "%s#%s(%s)",
                route.getBean(),
                route.getName(),
                route.getParameters().stream().map(NadParameter::getType).collect(Collectors.joining(","))
        );
    }

    @NonNull
    public List<String> getMethods() {
        return methods;
    }

    @NonNull
    public List<String> getPatterns() {
        return patterns;
    }

    @NonNull
    public List<NameValuePair> getHeaders() {
        return headers;
    }

    @NonNull
    public String getName() {
        return name;
    }

    @NonNull
    public String getBean() {
        return bean;
    }

    @NonNull
    public List<NadParameter> getParameters() {
        return parameters;
    }

    @NonNull
    public List<NadAnnotation> getAnnotations() {
        return annotations;
    }

    @NonNull
    public String getReturnType() {
        return returnType;
    }

    @NonNull
    public List<String> getConsumes() {
        return consumes;
    }

    @NonNull
    public List<String> getProduces() {
        return produces;
    }
}
