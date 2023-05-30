# nad-builder · [![LICENSE](https://img.shields.io/npm/l/@huolala-tech/nad-builder)](../LICENSE.txt) [![codecov](https://codecov.io/gh/HuolalaTech/nad/branch/main/graph/badge.svg?token=3YnCtwfAzL&flag=nad-builder)](https://app.codecov.io/gh/HuolalaTech/nad/tree/main/nad-builder)

Convert the Java AST to client-side code.

## Include

```shell
yarn add @huolala-tech/nad-builder
```

or

```shell
npm install @huolala-tech/nad-builder --save
```

## Demo

```typescript
import { Builder } from '@huolala-tech/nad-builder';

// You don't need to write this manually, as it can be obtained from the Java service.
const defs = {
  routes: [
    {
      name: 'foo',
      bean: 'test.Demo',
      methods: ['POST'],
      patterns: ['/foo'],
      parameters: [{ name: 'id', type: 'java.lang.Long' }],
      returnType: 'java.lang.Long',
    },
  ],
};
const base = 'http://localhost';
const target = 'ts';

const { code } = new Builder({ defs, target, base });

console.log(code); // Output the generated TypeScript code
```
