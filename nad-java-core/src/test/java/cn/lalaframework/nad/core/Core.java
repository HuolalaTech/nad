package cn.lalaframework.nad.core;

import cn.lalaframework.nad.interfaces.NadResult;
import cn.lalaframework.nad.models.NadContext;
import org.springframework.aop.ClassFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.Objects;

@Component
class Core {
    @Autowired
    private RequestMappingHandlerMapping rhMapping;

    @Nullable
    private volatile NadResult cache;

    @NonNull
    protected NadResult create() {
        if (cache == null) {
            synchronized (this) {
                if (cache == null) {
                    cache = this.create(null);
                }
            }
        }
        return Objects.requireNonNull(cache);
    }

    protected NadResult create(ClassFilter filter) {
        return NadContext.run(() -> {
            NadContext.collectSpringWeb(rhMapping);
            return NadContext.dump();
        }, filter);
    }
}
