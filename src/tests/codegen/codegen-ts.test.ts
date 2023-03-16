import { Builder } from '../../Builder';
import { User } from '../defs/User';
import { UserType } from '../defs/UserType';

const config = { base: 'test', target: 'ts' } as const;

const classes = [
  {
    name: 'test.People',
    members: [
      {
        name: 'name',
        type: 'java.lang.String',
      },
      {
        name: 'age',
        type: 'int',
      },
    ],
    superclass: 'java.lang.Object',
  },
];

test('addRequestParam', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    headers: [],
    parameters: [
      {
        name: 'id',
        type: 'java.lang.Long',
      },
    ],
    annotations: [],
    returnType: 'java.lang.Long',
  };
  const { code } = new Builder({ target: 'ts', base: '', defs: { routes: [foo], classes } });
  expect(code).toContain(`.addRequestParam('id', id)`);
});

test('addRequestParam renamed', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    headers: [],
    parameters: [
      {
        name: 'id',
        type: 'java.lang.Long',
        annotations: [{ type: 'org.springframework.web.bind.annotation.RequestParam', attributes: { value: 'hehe' } }],
      },
    ],
    annotations: [],
    returnType: 'java.lang.Long',
  };
  const { code } = new Builder({ ...config, defs: { routes: [foo], classes } });
  expect(code).toContain(`.addRequestParam('hehe', id)`);
});

test('addPathVariable', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    headers: [],
    parameters: [
      {
        name: 'id',
        type: 'java.lang.Long',
        annotations: [{ type: 'org.springframework.web.bind.annotation.PathVariable', attributes: { value: 'id' } }],
      },
    ],
    annotations: [],
    returnType: 'java.lang.Long',
  };
  const { code } = new Builder({ ...config, defs: { routes: [foo], classes } });
  expect(code).toContain(`.addPathVariable('id', id)`);
});

test('addPathVariable renamed', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    headers: [],
    parameters: [
      {
        name: 'id',
        type: 'java.lang.Long',
        annotations: [{ type: 'org.springframework.web.bind.annotation.PathVariable', attributes: { value: 'hehe' } }],
      },
      {
        name: 'name',
        type: 'java.lang.String',
        annotations: [{ type: 'org.springframework.web.bind.annotation.PathVariable' }],
      },
    ],
    annotations: [],
    returnType: 'java.lang.Long',
  };
  const { code } = new Builder({ ...config, defs: { routes: [foo], classes } });
  expect(code).toContain(`.addPathVariable('hehe', id)`);
  expect(code).toContain(`.addPathVariable('name', name)`);
});

test('addRequestBody', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    headers: [],
    parameters: [
      {
        name: 'people',
        type: 'test.People',
        annotations: [{ type: 'org.springframework.web.bind.annotation.RequestBody' }],
      },
    ],
    annotations: [],
    returnType: 'java.lang.Long',
  };
  const { code } = new Builder({ ...config, defs: { routes: [foo], classes } });
  expect(code).toContain(`.addRequestBody(people)`);
});

test('addNormalParam', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    headers: [],
    parameters: [
      {
        name: 'people',
        type: 'test.People',
      },
    ],
    annotations: [],
    returnType: 'java.lang.Long',
  };
  const { code } = new Builder({ ...config, defs: { routes: [foo], classes } });
  expect(code).toContain(`.addNormalParam(people)`);
});

test('addMultipartFile', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    headers: [],
    parameters: [
      {
        name: 'myFile',
        type: 'org.springframework.web.multipart.MultipartFile',
      },
    ],
    annotations: [],
    returnType: 'java.lang.Long',
  };
  const { code } = new Builder({ ...config, defs: { routes: [foo], classes } });
  expect(code).toContain(`.addMultipartFile('myFile', myFile)`);
});

test('addMultipartFile renamed', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    headers: [],
    parameters: [
      {
        name: 'myFileA',
        type: 'org.springframework.web.multipart.MultipartFile',
        annotations: [{ type: 'org.springframework.web.bind.annotation.RequestParam', attributes: { value: 'hehe' } }],
      },
      {
        name: 'myFileB',
        type: 'org.springframework.web.multipart.MultipartFile',
        annotations: [{ type: 'org.springframework.web.bind.annotation.RequestParam', attributes: {} }],
      },
    ],
    annotations: [],
    returnType: 'java.lang.Long',
  };
  const { code } = new Builder({ ...config, defs: { routes: [foo], classes } });
  expect(code).toContain(`async foo(myFileA: MultipartFile, myFileB: MultipartFile,`);
  expect(code).toContain(`.addMultipartFile('hehe', myFileA)`);
  expect(code).toContain(`.addMultipartFile('myFileB', myFileB)`);
});

test('default optional parameters', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    parameters: [
      {
        name: 'a1',
        type: 'java.lang.Long',
      },
      {
        name: 'a2',
        type: 'java.lang.Long',
      },
    ],
    returnType: 'java.lang.Long',
  };
  const { code } = new Builder({ ...config, defs: { routes: [foo], classes } });
  expect(code).toContain(`async foo(a1?: Long, a2?: Long, settings?: Partial<Settings>)`);
});

test('required parameters at first', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    parameters: [
      {
        name: 'a1',
        type: 'java.lang.Long',
        annotations: [{ type: 'org.springframework.web.bind.annotation.RequestParam', attributes: { required: true } }],
      },
      {
        name: 'a2',
        type: 'java.lang.Long',
      },
    ],
    returnType: 'java.lang.Long',
  };
  const { code } = new Builder({ ...config, defs: { routes: [foo], classes } });
  expect(code).toContain(`async foo(a1: Long, a2?: Long, settings?: Partial<Settings>)`);
});

test('required parameters at second', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    parameters: [
      {
        name: 'a1',
        type: 'java.lang.Long',
      },
      {
        name: 'a2',
        type: 'java.lang.Long',
        annotations: [{ type: 'org.springframework.web.bind.annotation.RequestParam', attributes: { required: true } }],
      },
    ],
    returnType: 'java.lang.Long',
  };
  const { code } = new Builder({ ...config, defs: { routes: [foo], classes } });
  expect(code).toContain(`async foo(a1: Long | null, a2: Long, settings?: Partial<Settings>)`);
});

test('enum as map key', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    parameters: [],
    returnType: 'java.util.Map<test.UserType, java.lang.Long>',
  };
  const { code } = new Builder({
    ...config,
    defs: { routes: [foo], classes: [], enums: [UserType] },
  });
  expect(code).toContain(`new NadInvoker<Record<UserType, Long>>`);
});

test('class as map key', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    parameters: [],
    returnType: 'java.util.Map<test.User, java.lang.Long>',
  };
  const { code } = new Builder({
    ...config,
    defs: { routes: [foo], classes: [User], enums: [UserType] },
  });
  expect(code).toContain(`new NadInvoker<Record<any, Long>>`);
});

test('long as map key', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    parameters: [],
    returnType: 'java.util.Map<java.lang.Long, java.lang.Long>',
  };
  const { code } = new Builder({
    ...config,
    defs: { routes: [foo], classes: [User], enums: [UserType] },
  });
  expect(code).toContain(`new NadInvoker<Record<Long, Long>>`);
});

test('HttpEntity', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    parameters: [
      {
        name: 'foo',
        type: 'org.springframework.http.HttpEntity<String>',
      },
    ],
  };
  const { code } = new Builder({
    ...config,
    defs: { routes: [foo], classes: [], enums: [] },
  });
  expect(code).toContain(`async foo(settings?:`);
});

test('BigDecimal and BigInteger', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    parameters: [
      {
        name: 'a',
        type: 'java.math.BigDecimal',
      },
      {
        name: 'b',
        type: 'java.math.BigInteger',
      },
    ],
  };
  const { code } = new Builder({
    ...config,
    defs: { routes: [foo], classes: [], enums: [] },
  });
  expect(code).toContain(`async foo(a?: BigDecimal, b?: BigInteger, settings?: Partial<Settings>) {`);
});

test('void and boolean', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    parameters: [
      {
        name: 'a',
        type: 'boolean',
      },
    ],
    returnType: 'void',
  };
  const { code } = new Builder({
    ...config,
    defs: { routes: [foo], classes: [], enums: [] },
  });
  expect(code).toContain(`async foo(a?: boolean, settings?: Partial<Settings>) {`);
  expect(code).toContain(`new NadInvoker<void>`);
});
