# nad-runtime · [![LICENSE](https://img.shields.io/npm/l/@huolala-tech/nad-runtime)](LICENSE.txt) [![codecov](https://codecov.io/gh/HuolalaTech/nad/branch/main/graph/badge.svg?token=3YnCtwfAzL&flag=nad-runtime)](https://app.codecov.io/gh/HuolalaTech/nad/tree/main/nad-runtime)

The runtime lib of the Nad project.

## Include

```bash
yarn add @huolala-tech/nad-runtime
```

or

```bash
npm install @huolala-tech/nad-runtime --save
```

## Useage

### 1. @PathVariable

```typescript
import { NadInvoker } from '@huolala-tech/nad-runtime';

// This code will request http://localhost/users/123 with GET mtehod.
const getUserInfo = async () => {
  return await new NadInvoker('http://localhost').open('GET', '/users/{id}').addPathVariable('id', 123).execute();
};
```

### 2. @RequestParam

```typescript
import { NadInvoker } from '@huolala-tech/nad-runtime';

// This code will request http://localhost/getUser?id=123 with GET mtehod.
const getUserInfo = async () => {
  return await new NadInvoker('http://localhost').open('GET', '/getUser').addRequestParam('id', id).execute();
};
```

### 2. @ModelAttribute

```typescript
import { NadInvoker } from '@huolala-tech/nad-runtime';

// This code will request http://localhost/getUser?id=1&type=2 with GET mtehod.
const getUserInfo = async () => {
  return await new NadInvoker('http://localhost')
    .open('GET', '/getUser')
    .addModelAttribute({ id: 1, type: 2 })
    .execute();
};
```

### 4. @RequestBody

```typescript
import { NadInvoker } from '@huolala-tech/nad-runtime';

// This code will request http://localhost/userService with POST mtehod and send payload {"id":123}.
const getUserInfo = async () => {
  return await new NadInvoker('http://localhost').open('POST', '/userService').addRequestBody({ id: 123 }).execute();
};
```
