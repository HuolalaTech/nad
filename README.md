# nad-core

This library is for collecting all Spring Web routes as a serializable data structure.

## GAV

```xml
<dependency>
    <groupId>cn.lalaframework</groupId>
    <artifactId>nad-core</artifactId>
    <version>1.0.0-SNAPSHOT</version>
</dependency>
```

## Usage

```java
import NadCore;
import NadResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
class MyComponent {
    @Autowired
    private NadCore nadCore;

    public void foo() {
        NadResult result = nadCore.create();
        // You can serialize this result as a json and transfer it to other services.
    }
}
```
