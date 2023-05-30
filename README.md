# [Nad](https://nad.huolala.cn/) · [![LICENSE](https://img.shields.io/github/license/HuolalaTech/nad)](LICENSE.txt) [![codecov](https://codecov.io/gh/HuolalaTech/nad/branch/main/graph/badge.svg?token=3YnCtwfAzL)](https://codecov.io/gh/HuolalaTech/nad)

## What is Nad?

**Nad**, pronounced [næd]，is taken from the initals of **N**ot **a** **D**ocument.
**This is not an API documentation tools!**
If what you need is API documentation, use the famous [Swagger](https://swagger.io/) or something similar.

Simply put, **Nad is a solution that bridges language boundaries**.
It extracts the data model and interface methods from the backend code and generates the corresponding frontend code.

## 1. Quick Start

### 1.1. The Backend

Before using it, make sure the backend API is based on the standard Spring Web approach.

#### STEP 1. Introduce in pom.xml

```xml
<dependency>
    <groupId>cn.lalaframework</groupId>
    <artifactId>nad-sdk</artifactId>
    <version>1.0.0-RELEASE</version>
</dependency>
```

#### STEP 2. Enable it in Spring

```properties
nad.enable=true
```

### 1.2. The Frontend

#### STEP 1. Install dependencies

```shell
npm install @huolala-tect/nad --save
```

#### STEP 2. Generate the code

After the backend provides the root URL of the API,
the following commands can be used to generate the corresponding ts file based on the URL.

For example, if the backend service is started locally and the interface URL is `http://localhost:8080`,
and you want to the generated file to be written to `src/api.ts`, then execute the following command

```shell
npx nad http://localhost:8080 -o src/api.ts
```

#### STEP 3. Using in your code

You can use the IDE to open `src/api.ts` to see the interface definition,
and then import the corresponding module in the business code to use it.
If the backend code has enough detailed annotaitons, the generated code is theoretically protected from all details.

## Develop

### Module Structure

| Module        | Type  | Description               |
| ------------- | ----- | ------------------------- |
| nad-builder   | TS    | The core of code builder  |
| nad-cli       | TS    | Command-Line tools        |
| nad-runtime   | TS    | Frontend network library  |
| nad-java-core | Java  | The core of the SDK       |
| nad-java-skd  | Java  | Java SDK                  |
| nad-ui        | React | UI for rendering api list |
| nad-home      | React | Intruduction website      |
