# nad-core · [![LICENSE](https://img.shields.io/github/license/HuolalaTech/nad)](../../LICENSE.txt)

This library is for collecting all Spring Web routes as a serializable data structure.

| Framework                                                                                                                                                                                                              | Coverage                                                                                                                                                                                                                        |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [![2.2.6.RELEASE](https://img.shields.io/badge/Spring%20Boot-2.2.6.RELEASE-gray?logo=spring&logoColor=white&labelColor=6DB33F)](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot/2.2.6.RELEASE) | [![codecov](https://codecov.io/gh/HuolalaTech/nad/branch/main/graph/badge.svg?token=3YnCtwfAzL&flag=nad-java-core-spring-boot-2.2)](https://app.codecov.io/gh/HuolalaTech/nad/flags?flags%5B0%5D=nad-java-core-spring-boot-2.2) |
| [![2.7.13](https://img.shields.io/badge/Spring%20Boot-2.7.13-gray?logo=spring&logoColor=white&labelColor=6DB33F)](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot/2.7.13)                      | [![codecov](https://codecov.io/gh/HuolalaTech/nad/branch/main/graph/badge.svg?token=3YnCtwfAzL&flag=nad-java-core-spring-boot-2.7)](https://app.codecov.io/gh/HuolalaTech/nad/flags?flags%5B0%5D=nad-java-core-spring-boot-2.7) |
| [![3.1.0](https://img.shields.io/badge/Spring%20Boot-3.1.0-gray?logo=spring&logoColor=white&labelColor=6DB33F)](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot/3.1.0)                         | [![codecov](https://codecov.io/gh/HuolalaTech/nad/branch/main/graph/badge.svg?token=3YnCtwfAzL&flag=nad-java-core-spring-boot-3.1)](https://app.codecov.io/gh/HuolalaTech/nad/flags?flags%5B0%5D=nad-java-core-spring-boot-3.1) |


## GAV

```xml
<dependency>
    <groupId>cn.lalaframework</groupId>
    <artifactId>nad-core</artifactId>
    <version>1.0.1-RELEASE</version>
</dependency>
```

## Usage

```java
import cn.lalaframework.nad.interfaces.NadResult;
import cn.lalaframework.nad.models.NadContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@Component
class MyComponent {
    @Autowired
    private RequestMappingHandlerMapping map;

    public void foo() {
        NadResult result = NadContext.run(() -> {
            NadContext.collectSpringWeb(map);
            return NadContext.dump();
        }, null);
        // You can serialize this result as a json and transfer it to other services.
    }
}
```
