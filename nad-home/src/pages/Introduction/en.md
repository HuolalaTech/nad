# What is Nad?

**Nad**, pronounced [næd]，is taken from the initals of **N**ot **a** **D**ocument.
**This is not an API documentation tools!**
If what you need is API documentation, use the famous [Swagger](https://swagger.io/) or something similar.

Simply put, **Nad is a solution that bridges language boundaries**.
It extracts the data model and interface methods from the backend code and generates the corresponding frontend code.

# 1. Quick Start

## 1.1. The Backend

Before using it, make sure the backend API is based on the standard Spring Web approach.

### STEP 1. Introduce in pom.xml

```pom.xml
<dependency>
	<groupId>cn.lalaframework</groupId>
	<artifactId>nad-sdk</artifactId>
	<version>1.0.0-RELEASE</version>
</dependency>
```

### STEP 2. Enable it in Spring

```application.properties
nad.enable=true
```

## 1.2. The Frontend

### STEP 1. Install dependencies

```shell
npm install @huolala-tech/nad-cli --save
```

### STEP 2. Generate the code

After the backend provides the root URL of the API,
the following commands can be used to generate the corresponding ts file based on the URL.

For example, if the backend service is started locally and the interface URL is `http://localhost:8080`,
and you want to the generated file to be written to `src/api.ts`, then execute the following command

```shell
npx nad http://localhost:8080 -o src/api.ts
```

### STEP 3. Using in your code

You can use the IDE to open `src/api.ts` to see the interface definition,
and then import the corresponding module in the business code to use it.
If the backend code has enough detailed annotaitons, the generated code is theoretically protected from all details.

# 2. Extending reading

## 2.1. Background knowledge

Communication between peoples relies on language and text, while communication between programs relies on APIs, but programs usually use different programming languages and frameworks. For example, Java is used for backend, TypeScript for frontend, OC and Swift for mobile.

Just like the language barrier between peoples, the language barrier between programs leads to a lot of time for development teams to understand each other. At the same time, it is also necessary to write a lot of descriptions of the API in the form of documentation, which people call interface documentation.

For a long time, it has been common in large projects to use interface documents to do cross-team interfacing. However, writing these interface documents takes a lot of time. And this is not a one-time effort, but a long-term commitment.

Products and programs are constantly being iterated and updated, and the interface documentation needs to be constantly updated as well. Once the developers change the program, they need to consider modifying the interface documentation. Therefore, the workload of maintaining the interface documentation is multiplied by the daily development work, which is an extremely time-consuming part of the development process.

In addition to the workload problem, there is also a reliability problem because the interface documentation is maintained manually. The involvement of “people” in engineering practice brings a kind of uncertainty to the results. If a human makes a mistake, the consequences will be unpredictable.

**Nad** tries to provide a solution that does not require interface documentation to handle interfacing of programs across teams and languages.
It can analyze model definitions of interfaces and data to generate another code from one kind of code.
**Makes API calls look like native function calls**, with type definitions and annotations prompted directly in the IDE.
