package cn.lalaframework.nad;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.concurrent.TimeUnit;

@Configuration
@ConditionalOnProperty(prefix = "nad", value = "ui", havingValue = "true", matchIfMissing = true)
public class NadUiConfiguration implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/nad/404")
                .addResourceLocations("classpath:/nad-ui/404")
                .setCacheControl(CacheControl.maxAge(1, TimeUnit.HOURS))
                .resourceChain(true)
                .addResolver(new NadResourceResolver());

        registry.addResourceHandler("/nad/logo.svg")
                .addResourceLocations("classpath:/nad-ui/logo.svg")
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

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Although RFC2616 stipulates that the Location header must be an absolute URI,
        // the more recent specification RFC7231 has been revised to allow the use of a relative URI,
        // which is also supported by major browsers.
        registry.addRedirectViewController("/nad", "/nad/");
    }
}
