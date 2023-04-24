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

    /**
     * Find all routes from Spring Web and create a NadResult.
     * @return A NadResult object.
     */
    @NonNull
    public NadResult create() {
        return create(null);
    }

    /**
     * Find all routes from Spring Web and create a NadResult.
     * @param classExcluder An implementation of the ClassFilter interface to specify which classes should be excluded.
     *                      You can also use the util implementation of cn.lalaframework.nad.utils.ClassExcluder.
     * @return A NadResult object.
     */
    @NonNull
    public NadResult create(ClassFilter classExcluder) {
        if (handlerMapping == null) throw new NoHandlerMappingException();
        return NadContext.run(() -> {
            List<NadRoute> routes = NadRoute.fromMapping(handlerMapping);
            List<NadModule> modules = NadModule.fromMapping(handlerMapping);
            List<NadClass> classes = NadContext.dumpClasses();
            List<NadEnum> enums = NadContext.dumpEnums();
            return new NadResult(modules, routes, classes, enums);
        }, classExcluder);
    }
}

