package cn.lalaframework.nad.models;

import org.springframework.lang.NonNull;
import org.springframework.util.MimeType;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;

import java.util.List;
import java.util.stream.Collectors;

import static cn.lalaframework.nad.utils.PatternsUtil.getActivePatterns;

public class NadRouterSpringWeb extends NadRouteHandlerImpl implements NadRoute {
    @NonNull
    private final List<String> methods;
    @NonNull
    private final List<String> patterns;
    @NonNull
    private final List<NameValuePair> headers;
    @NonNull
    private final List<String> consumes;
    @NonNull
    private final List<String> produces;

    public NadRouterSpringWeb(@NonNull RequestMappingInfo info, @NonNull HandlerMethod handler) {
        super(handler);
        methods = info.getMethodsCondition()
                .getMethods()
                .stream()
                .map(Enum::name)
                .collect(Collectors.toList());
        headers = info.getHeadersCondition()
                .getExpressions()
                .stream()
                .map(NameValuePair::new)
                .collect(Collectors.toList());
        consumes = info.getConsumesCondition()
                .getConsumableMediaTypes()
                .stream()
                .map(MimeType::toString)
                .collect(Collectors.toList());
        produces = info.getProducesCondition()
                .getProducibleMediaTypes()
                .stream()
                .map(MimeType::toString)
                .collect(Collectors.toList());
        patterns = getActivePatterns(info);
    }

    @Override
    @NonNull
    public List<String> getMethods() {
        return methods;
    }

    @Override
    @NonNull
    public List<String> getPatterns() {
        return patterns;
    }

    @Override
    @NonNull
    public List<NameValuePair> getHeaders() {
        return headers;
    }

    @Override
    @NonNull
    public List<String> getConsumes() {
        return consumes;
    }

    @Override
    @NonNull
    public List<String> getProduces() {
        return produces;
    }
}
