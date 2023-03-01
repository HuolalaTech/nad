package cn.lalaframework.nad;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Import({NadCore.class})
@Configuration
public class NadCoreAutoConfiguration {
}
