package cn.lalaframework.nad;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.concurrent.TimeUnit;

@Configuration
@ConditionalOnProperty(prefix = "nad", value = "ui", havingValue = "true", matchIfMissing = true)
public class NadUiConfiguration implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // NOTE: The later register, the higher the priority.

        registry.addResourceHandler("/nad", "/nad/", "/nad/**")
                .addResourceLocations("classpath:/nad-ui/index.html")
                .setCacheControl(CacheControl.noCache())
                .resourceChain(true)
                .addResolver(new NadResourceResolver());

        registry.addResourceHandler("/nad/*.svg", "/nad/*.json")
                .addResourceLocations("classpath:/nad-ui/")
                .setCacheControl(CacheControl.maxAge(1, TimeUnit.HOURS))
                .resourceChain(true);

        registry.addResourceHandler("/nad/static/**")
                .addResourceLocations("classpath:/nad-ui/static/")
                .setCacheControl(CacheControl.maxAge(100, TimeUnit.DAYS))
                .resourceChain(true);
    }
}
