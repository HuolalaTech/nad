# nad-builder

Convert Nad Java definition AST to client code.

## Include

```shell
yarn add @huolala-tech/nad-builder
```

or

```shell
npm install @huolala-tech/nad-builder
```

## Demo

```typescript
import { Builder } from '@huolala-tech/nad-builder';

const defs = {
  routes: [
    {
      name: 'foo',
      bean: 'test.Demo',
      methods: ['POST'],
      patterns: ['/foo'],
      parameters: [
        {
          name: 'id',
          type: 'java.lang.Long',
        },
      ],
      returnType: 'java.lang.Long',
    },
  ],
};
const base = 'http://localhost';
const target = 'ts';

const { code } = new Builder({ defs, target, base });

console.log(code); // Output the generated TypeScript code
```

## The **defs** type

```typescript
interface Parameter {
  name: string;
  type: string;
  annotations: Annotation[];
}

interface Annotation {
  type: string;
  attributes: Record<string, unknown>;
}

interface Route {
  name: string;
  bean: string;
  methods: string[];
  patterns: string[];
  headers: string[];
  parameters: Parameter[];
  annotations: Annotation[];
  returnType: string;
}

interface Member {
  name: string;
  type: string;
  annotations: [Annotation[], Annotation[], Annotation[]];
}

interface Class {
  name: string;
  annotations: Annotation[];
  typeParameters: string[];
  members: Member[];
  superclass: string;
}

interface Constant {
  name: string;
  value: string;
  properties: Record<string, unknown>;
}

interface Enum {
  name: string;
  annotations: Annotation[];
  constants: Constant[];
}

interface Defs {
  routes: Route[];
  classes: Class[];
  enums: Enum[];
}
```
