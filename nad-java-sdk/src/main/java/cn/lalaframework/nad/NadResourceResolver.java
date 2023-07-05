package cn.lalaframework.nad;

import org.springframework.core.io.Resource;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.resource.PathResourceResolver;

public class NadResourceResolver extends PathResourceResolver {
    @Override
    protected Resource getResource(@NonNull String resourcePath, @NonNull Resource location) {
        return location;
    }
}
