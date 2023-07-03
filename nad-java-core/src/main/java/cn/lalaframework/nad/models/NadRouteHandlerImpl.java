package cn.lalaframework.nad.models;

import cn.lalaframework.nad.interfaces.NadAnnotation;
import cn.lalaframework.nad.interfaces.NadParameter;
import cn.lalaframework.nad.interfaces.NadRouteHandler;
import org.springframework.lang.NonNull;
import org.springframework.web.method.HandlerMethod;

import java.lang.reflect.Method;
import java.util.List;

public class NadRouteHandlerImpl implements NadRouteHandler {
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

    public NadRouteHandlerImpl(@NonNull HandlerMethod handler) {
        Method method = handler.getMethod();
        name = method.getName();
        bean = handler.getBeanType().getTypeName();
        NadContext.collectModule(handler.getBeanType());
        parameters = NadParameterImpl.fromHandler(handler);
        annotations = NadAnnotationImpl.fromAnnotatedElement(method);
        returnType = method.getGenericReturnType().getTypeName();
        NadContext.collectType(method.getGenericReturnType());
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
