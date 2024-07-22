package cn.lalaframework.nad.models;

import cn.lalaframework.nad.interfaces.NadMethod;
import cn.lalaframework.nad.interfaces.NadParameter;
import org.springframework.lang.NonNull;
import org.springframework.web.method.HandlerMethod;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class NadMethodImpl extends NadDefImpl implements NadMethod {
    @NonNull
    private final List<String> typeParameters;

    @NonNull
    private final String returnType;

    @NonNull
    private final List<NadParameter> parameters;

    private final int modifiers;

    public NadMethodImpl(@NonNull Method method) {
        super(method.getName(), NadAnnotationImpl.fromAnnotatedElement(method));
        parameters = Arrays.stream(method.getParameters()).map(NadParameterImpl::new).collect(Collectors.toList());
        typeParameters = buildTypeParameters(method);
        returnType = NadContext.cc(method.getGenericReturnType());
        modifiers = method.getModifiers();
    }

    public NadMethodImpl(@NonNull HandlerMethod h) {
        super(h.getMethod().getName(), NadAnnotationImpl.fromAnnotatedElement(h.getMethod()));
        parameters = Arrays.stream(h.getMethodParameters()).map(NadParameterImpl::new).collect(Collectors.toList());
        typeParameters = buildTypeParameters(h.getMethod());
        returnType = NadContext.cc(h.getMethod().getGenericReturnType());
        modifiers = h.getMethod().getModifiers();
    }

    private static List<String> buildTypeParameters(Method method) {
        return Arrays.stream(method.getTypeParameters()).map(NadContext::cc).collect(Collectors.toList());
    }

    @Override
    @NonNull
    public List<String> getTypeParameters() {
        return typeParameters;
    }

    @Override
    @NonNull
    public String getReturnType() {
        return returnType;
    }

    @Override
    @NonNull
    public List<NadParameter> getParameters() {
        return parameters;
    }

    @Override
    public int getModifiers() {
        return modifiers;
    }
}
