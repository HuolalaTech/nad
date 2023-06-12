package cn.lalaframework.nad;

import org.springframework.core.io.Resource;
import org.springframework.web.servlet.resource.PathResourceResolver;

public class NadResourceResolver extends PathResourceResolver {
    @Override
    protected Resource getResource(String resourcePath, Resource location) {
        return location.isReadable() ? location : null;
    }
}
