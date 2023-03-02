package cn.lalaframework.nad;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Import({NadApiController.class, NadWebMvcConfiguration.class})
@Configuration
public class NadAutoConfiguration {
}
