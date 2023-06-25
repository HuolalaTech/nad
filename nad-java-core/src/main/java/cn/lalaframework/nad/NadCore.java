package cn.lalaframework.nad;

import cn.lalaframework.nad.exceptions.NoHandlerMappingException;
import cn.lalaframework.nad.models.NadContext;
import cn.lalaframework.nad.models.NadResult;
import cn.lalaframework.nad.models.NadRouterSpringWeb;
import org.springframework.aop.ClassFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@Component
public class NadCore {
    @Autowired(required = false)
    private RequestMappingHandlerMapping handlerMapping;

    /**
     * Find all routes from Spring Web and create a NadResult.
     *
     * @return A NadResult object.
     */
    @NonNull
    public NadResult create() {
        return create(null);
    }

    @NonNull
    private NadResult createFromSpringHandlerMapping() {
        if (handlerMapping == null) throw new NoHandlerMappingException();
        handlerMapping.getHandlerMethods().entrySet().stream()
                // Ignore some classes who are specified by ClassExcluder
                .filter(e -> NadContext.matchClass(e.getValue().getBeanType()))
                .forEach(e ->
                        NadContext.collectRoute(
                                new NadRouterSpringWeb(e.getKey(), e.getValue())
                        )
                );

        return NadContext.dump();
    }

    /**
     * Find all routes from Spring Web and create a NadResult.
     *
     * @param classExcluder An implementation of the ClassFilter interface to specify which classes should be excluded.
     *                      You can also use the util implementation of cn.lalaframework.nad.utils.ClassExcluder.
     * @return A NadResult object.
     */
    @NonNull
    public NadResult create(ClassFilter classExcluder) {
        return NadContext.run(this::createFromSpringHandlerMapping, classExcluder);
    }
}

