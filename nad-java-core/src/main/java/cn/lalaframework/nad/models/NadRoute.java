package cn.lalaframework.nad.models;

import org.springframework.lang.NonNull;
import org.springframework.util.MimeType;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import static cn.lalaframework.nad.utils.PatternsUtil.getActivePatterns;

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

    private NadRoute(@NonNull RequestMappingInfo info, @NonNull HandlerMethod method) {
        name = method.getMethod().getName();
        bean = method.getBeanType().getTypeName();

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
        parameters = Arrays.stream(method.getMethodParameters()).map(NadParameter::new).collect(Collectors.toList());
        annotations = NadAnnotation.fromAnnotatedElement(method.getMethod());
        Type genericReturnType = method.getMethod().getGenericReturnType();
        NadContext.collect(genericReturnType);
        returnType = genericReturnType.getTypeName();
    }

    @NonNull
    public static List<NadRoute> fromMapping(@NonNull RequestMappingHandlerMapping requestMappingHandlerMapping) {
        return requestMappingHandlerMapping.getHandlerMethods().entrySet().stream()
                // Ignore some classes who are specified by ClassExcluder
                .filter(e -> NadContext.matchClass(e.getValue().getBeanType()))
                .map(e -> new NadRoute(e.getKey(), e.getValue()))
                // The HandlerMethods object is unsorted.
                // To ensure that uniformity of the results, it is necessary to be sorted.
                .sorted(Comparator.comparing(NadRoute::getSortKey))
                .collect(Collectors.toList());
    }

    /**
     * There are two advantages for this sort key:
     * 1. Methods on the same controller will be grouped together, because the package name is included.
     * 2. There is no conflict even if the methods are overloaded, because the parameters are included.
     */
    @NonNull
    private static String getSortKey(@NonNull NadRoute route) {
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
