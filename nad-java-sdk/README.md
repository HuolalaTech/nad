# nad-sdk · [![LICENSE](https://img.shields.io/github/license/HuolalaTech/nad)](../../LICENSE.txt)

A Java SDK that produces typed Java definitions, which can be used to create code for another platform.

| Framework                                                                                                                                                                                                              | Coverage                                                                                                                                                                                                                        |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [![2.2.6.RELEASE](https://img.shields.io/badge/Spring%20Boot-2.2.6.RELEASE-gray?logo=spring&logoColor=white&labelColor=6DB33F)](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot/2.2.6.RELEASE) | [![codecov](https://codecov.io/gh/HuolalaTech/nad/branch/main/graph/badge.svg?token=3YnCtwfAzL&flag=nad-java-sdk-spring-boot-2.2)](https://app.codecov.io/gh/HuolalaTech/nad/flags?flags%5B0%5D=nad-java-sdk-spring-boot-2.2) |
| [![2.7.13](https://img.shields.io/badge/Spring%20Boot-2.7.13-gray?logo=spring&logoColor=white&labelColor=6DB33F)](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot/2.7.13)                      | [![codecov](https://codecov.io/gh/HuolalaTech/nad/branch/main/graph/badge.svg?token=3YnCtwfAzL&flag=nad-java-sdk-spring-boot-2.7)](https://app.codecov.io/gh/HuolalaTech/nad/flags?flags%5B0%5D=nad-java-sdk-spring-boot-2.7) |
| [![3.1.0](https://img.shields.io/badge/Spring%20Boot-3.1.0-gray?logo=spring&logoColor=white&labelColor=6DB33F)](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot/3.1.0)                         | [![codecov](https://codecov.io/gh/HuolalaTech/nad/branch/main/graph/badge.svg?token=3YnCtwfAzL&flag=nad-java-sdk-spring-boot-3.1)](https://app.codecov.io/gh/HuolalaTech/nad/flags?flags%5B0%5D=nad-java-sdk-spring-boot-3.1) |

## GAV

```xml
<dependency>
    <groupId>cn.lalaframework</groupId>
    <artifactId>nad-sdk</artifactId>
    <version>1.0.0-RELEASE</version>
</dependency>
```

## Configuration

To ensure security, the nad-sdk is disabled by default. You can add the following configuration to
your `application.properties` to manually enable it.

```properties
nad.enable=true
```

## Nad UI

Access your project web page, such as http://localhost:8080/nad/, to visit the Nad UI page.

> The Nad UI is enabled by default once the Nad component is enabled.
> You can also manually disable it by setting `nad.ui=false` in `application.properties`.
