package cn.lalaframework.nad.models;

import org.springframework.lang.NonNull;
import org.springframework.web.method.HandlerMethod;

import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class SpringRouteHandler implements NadRouteHandler {
    @NonNull
    private final String name;
    @NonNull
    private final String bean;
    @NonNull
    private final List<NadParameter> parameters;
    @NonNull
    private final List<NadAnnotation> annotations;
    @NonNull
    private final String returnType;

    public SpringRouteHandler(@NonNull HandlerMethod handler) {
        name = handler.getMethod().getName();
        Class<?> module = handler.getBeanType();
        NadContext.collectModule(module);
        bean = module.getTypeName();
        parameters = Arrays.stream(handler.getMethodParameters()).map(NadParameter::new).collect(Collectors.toList());
        annotations = NadAnnotation.fromAnnotatedElement(handler.getMethod());
        Type genericReturnType = handler.getMethod().getGenericReturnType();
        NadContext.collect(genericReturnType);
        returnType = genericReturnType.getTypeName();
    }

    @Override
    @NonNull
    public String getName() {
        return name;
    }

    @Override
    @NonNull
    public String getBean() {
        return bean;
    }

    @Override
    @NonNull
    public List<NadParameter> getParameters() {
        return parameters;
    }

    @Override
    @NonNull
    public List<NadAnnotation> getAnnotations() {
        return annotations;
    }

    @Override
    @NonNull
    public String getReturnType() {
        return returnType;
    }
}
