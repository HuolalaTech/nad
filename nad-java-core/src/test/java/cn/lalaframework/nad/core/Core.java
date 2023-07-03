package cn.lalaframework.nad.core;

import cn.lalaframework.nad.interfaces.NadResult;
import cn.lalaframework.nad.models.NadContext;
import org.springframework.aop.ClassFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@Component
class Core {
    @Autowired
    private RequestMappingHandlerMapping rhMapping;

    protected NadResult create() {
        return this.create(null);
    }

    protected NadResult create(ClassFilter filter) {
        return NadContext.run(() -> {
            NadContext.collectSpringWeb(rhMapping);
            return NadContext.dump();
        }, filter);
    }
}
