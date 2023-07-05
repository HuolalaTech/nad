# nad-core · [![LICENSE](https://img.shields.io/github/license/HuolalaTech/nad)](../../LICENSE.txt) [![codecov](https://codecov.io/gh/HuolalaTech/nad/branch/main/graph/badge.svg?token=3YnCtwfAzL&flag=nad-java-core)](https://app.codecov.io/gh/HuolalaTech/nad/tree/main/nad-java-core)

This library is for collecting all Spring Web routes as a serializable data structure.

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
