package cn.lalaframework.nad;

import cn.lalaframework.nad.exceptions.NoHandlerMappingException;
import cn.lalaframework.nad.models.*;
import org.springframework.aop.ClassFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.List;

@Component
public class NadCore {
    @Autowired(required = false)
    private RequestMappingHandlerMapping handlerMapping;

    @NonNull
    public NadResult create() {
        return create(null);
    }

    @NonNull
    public NadResult create(ClassFilter classFilter) {
        if (handlerMapping == null) throw new NoHandlerMappingException();
        return NadContext.run(() -> {
            List<NadRoute> routes = NadRoute.fromMapping(handlerMapping);
            List<NadModule> modules = NadModule.fromMapping(handlerMapping);
            List<NadClass> classes = NadContext.dumpClasses();
            List<NadEnum> enums = NadContext.dumpEnums();
            return new NadResult(modules, routes, classes, enums);
        }, classFilter);
    }
}

