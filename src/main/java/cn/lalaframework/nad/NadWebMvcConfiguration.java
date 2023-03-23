package cn.lalaframework.nad;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.CacheControl;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.concurrent.TimeUnit;

@Component
@ConditionalOnProperty(prefix = "nad", value = "ui", havingValue = "true", matchIfMissing = true)
public class NadWebMvcConfiguration implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/nad/favicon.svg")
                .addResourceLocations("classpath:/nad-ui/favicon.svg")
                .setCacheControl(CacheControl.maxAge(1, TimeUnit.HOURS))
                .resourceChain(true)
                .addResolver(new NadResourceResolver());

        registry.addResourceHandler("/nad/asset-manifest.json")
                .addResourceLocations("classpath:/nad-ui/asset-manifest.json")
                .setCacheControl(CacheControl.noCache())
                .resourceChain(true)
                .addResolver(new NadResourceResolver());

        registry.addResourceHandler("/nad/static/**")
                .addResourceLocations("classpath:/nad-ui/static/")
                .setCacheControl(CacheControl.maxAge(100, TimeUnit.DAYS))
                .resourceChain(true);

        registry.addResourceHandler("/nad/", "/nad/**")
                .addResourceLocations("classpath:/nad-ui/index.html")
                .setCacheControl(CacheControl.noCache())
                .resourceChain(true)
                .addResolver(new NadResourceResolver());
    }

    public void redirect(ViewControllerRegistry registry) {
        registry.addRedirectViewController("/nad", "/nad/");
    }
}
