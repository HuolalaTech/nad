# nad-sdk

Nad (named from **N**ot **a** **D**ocument) is a Java component that exports typed Java definitions for generating associated code for another platform.

## GAV

```xml
<dependency>
    <groupId>cn.lalaframework</groupId>
    <artifactId>nad-sdk</artifactId>
    <version>1.0.0-SNAPSHOT</version>
</dependency>
```

## Configuration

To ensure security, the nad-sdk is disabled by default.
You can add the following configuration to your `application.properties` to manually enable it.

```properties
nad.enable = true
```

## Nad UI

Access your project web page, such as http://localhost:8080/nad/, to visit the Nad UI page.

> The Nad UI is enabled by default once the Nad component is enabled.
> You can also manually disable it by setting `nad.ui = false` in `application.properties`.
