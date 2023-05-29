package cn.lalaframework.nad.models;

import org.springframework.lang.NonNull;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.List;
import java.util.stream.Collectors;

public class NadModule extends NadDef {
    private NadModule(Class<?> clz) {
        super(clz);
    }

    @NonNull
    public static List<NadModule> fromMapping(@NonNull RequestMappingHandlerMapping requestMappingHandlerMapping) {
        return requestMappingHandlerMapping.getHandlerMethods().values().stream()
                .map(HandlerMethod::getBeanType)
                .distinct()
                .map(NadModule::new)
                .collect(Collectors.toList());
    }
}
