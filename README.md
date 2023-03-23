# nad-builder · [![LICENSE](https://img.shields.io/npm/l/@huolala-tech/nad-builder)](LICENSE.txt)

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

See [./src/types.nad.ts](./src/types/nad.ts)
