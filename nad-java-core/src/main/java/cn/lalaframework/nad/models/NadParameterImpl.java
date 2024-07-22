package cn.lalaframework.nad.models;

import cn.lalaframework.nad.interfaces.NadParameter;
import org.springframework.core.DefaultParameterNameDiscoverer;
import org.springframework.core.MethodParameter;
import org.springframework.core.ParameterNameDiscoverer;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.lang.reflect.Parameter;
import java.lang.reflect.Type;
import java.util.Optional;

public class NadParameterImpl extends NadDefImpl implements NadParameter {
    @Nullable
    private static ParameterNameDiscoverer parameterNameDiscoverer;
    @NonNull
    private final String type;

    public NadParameterImpl(@NonNull MethodParameter p) {
        super(initAndGetName(p), NadAnnotationImpl.fromArray(p.getParameterAnnotations()));
        Type parameterType = p.getGenericParameterType();
        NadContext.collectType(parameterType);
        type = parameterType.getTypeName();
    }

    public NadParameterImpl(@NonNull Parameter p) {
        super(p.getName(), NadAnnotationImpl.fromArray(p.getAnnotations()));
        Type pType = p.getParameterizedType();
        NadContext.collectType(pType);
        type = pType.getTypeName();
    }

    @NonNull
    private static String initAndGetName(MethodParameter p) {
        // Security for threads is not necessary here.
        // Because a NadCore always runs in a single thread.
        // Besides, the DefaultParameterNameDiscoverer is a stateless class,
        // so even repeated creation is not a big deal.
        if (parameterNameDiscoverer == null) parameterNameDiscoverer = new DefaultParameterNameDiscoverer();
        p.initParameterNameDiscovery(parameterNameDiscoverer);
        return Optional.ofNullable(p.getParameterName()).orElse("");
    }

    @Override
    @NonNull
    public String getType() {
        return type;
    }
}
