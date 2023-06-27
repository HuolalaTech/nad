package cn.lalaframework.nad.models;

import org.springframework.core.DefaultParameterNameDiscoverer;
import org.springframework.core.MethodParameter;
import org.springframework.core.ParameterNameDiscoverer;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.web.method.HandlerMethod;

import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class NadParameter {
    @Nullable
    private static ParameterNameDiscoverer parameterNameDiscoverer;
    @Nullable
    private final String name;
    @NonNull
    private final String type;
    @NonNull
    private final List<NadAnnotation> annotations;

    public NadParameter(@NonNull MethodParameter p) {
        p.initParameterNameDiscovery(getParameterNameDiscoverer());
        name = p.getParameterName();
        Type parameterType = p.getGenericParameterType();
        NadContext.collect(parameterType);
        type = parameterType.getTypeName();
        annotations = NadAnnotation.fromArray(p.getParameterAnnotations());
    }

    @NonNull
    private static ParameterNameDiscoverer getParameterNameDiscoverer() {
        if (parameterNameDiscoverer != null) return parameterNameDiscoverer;
        // Security for threads is not necessary here.
        // Because a NadCore always runs in a single thread.
        // Besides, the DefaultParameterNameDiscoverer is a stateless class,
        // so even repeated creation is not a big deal.
        parameterNameDiscoverer = new DefaultParameterNameDiscoverer();
        return parameterNameDiscoverer;
    }

    @Nullable
    public String getName() {
        return name;
    }

    @NonNull
    public String getType() {
        return type;
    }

    @NonNull
    public List<NadAnnotation> getAnnotations() {
        return annotations;
    }

    protected static List<NadParameter> fromHandler(HandlerMethod handler) {
        return Arrays.stream(handler.getMethodParameters()).map(NadParameter::new).collect(Collectors.toList());
    }
}
