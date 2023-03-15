# nad-runtime · [![LICENSE](https://img.shields.io/npm/l/@huolala-tech/nad-runtime)](LICENSE.txt)

The runtime lib of NAD project.

## Include

```bash
yarn add @huolala-tech/nad-runtime
```

or

```bash
npm install @huolala-tech/nad-runtime --save
```

## Useage

### 1. Param in path

```typescript
import { NadInvoker } from '@huolala-tech/nad-runtime';

// This code will request http://localhost/users/123 with GET mtehod.
const getUserInfo = async () => {
  return await new NadInvoker('http://localhost')
    .open('GET', '/users/{id}')
    .addPathVariable('id', 123)
    .execute();
};
```

### 2. Param in QueryString

```typescript
import { NadInvoker } from '@huolala-tech/nad-runtime';

// This code will request http://localhost/getUser?id=123 with GET mtehod.
const getUserInfo = async () => {
  return await new NadInvoker('http://localhost')
    .open('GET', '/getUser')
    .addRequestParameter('id', id)
    .execute();
};
```

### 3. Param in body

```typescript
import { NadInvoker } from '@huolala-tech/nad-runtime';

// This code will request http://localhost/userService with POST mtehod and send payload {"id":123}.
const getUserInfo = async () => {
  return await new NadInvoker('http://localhost')
    .open('POST', '/userService')
    .addRequestBody({ id: 123 })
    .execute();
};
```
