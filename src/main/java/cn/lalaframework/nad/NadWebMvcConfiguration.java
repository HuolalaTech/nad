package cn.lalaframework.nad;

import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Component
public class NadWebMvcConfiguration implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/nad/favicon.svg")
                .addResourceLocations("classpath:/nad-ui/favicon.svg")
                .setCacheControl(CacheControl.maxAge(1, TimeUnit.HOURS))
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        return location.exists() && location.isReadable() ? location : null;
                    }
                });
        registry.addResourceHandler("/nad/static/**")
                .addResourceLocations("classpath:/nad-ui/static/")
                .setCacheControl(CacheControl.maxAge(100, TimeUnit.DAYS))
                .resourceChain(true);
        registry.addResourceHandler("/nad/", "/nad/**")
                .addResourceLocations("classpath:/nad-ui/index.html")
                .setCacheControl(CacheControl.noCache())
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        return location.exists() && location.isReadable() ? location : null;
                    }
                });
    }

    public void redirect(ViewControllerRegistry registry) {
        registry.addRedirectViewController("/nad", "/nad/");
    }
}
