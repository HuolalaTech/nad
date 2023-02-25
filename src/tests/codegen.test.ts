import { Builder } from '../Builder';

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
    methods: ['POST'],
    patterns: ['/foo'],
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
    methods: ['POST'],
    patterns: ['/foo'],
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
    methods: ['POST'],
    patterns: ['/foo/{id}'],
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
    methods: ['POST'],
    patterns: ['/foo/{id}'],
    headers: [],
    parameters: [
      {
        name: 'id',
        type: 'java.lang.Long',
        annotations: [{ type: 'org.springframework.web.bind.annotation.PathVariable', attributes: { value: 'hehe' } }],
      },
    ],
    annotations: [],
    returnType: 'java.lang.Long',
  };
  const { code } = new Builder({ ...config, defs: { routes: [foo], classes } });
  expect(code).toContain(`.addPathVariable('hehe', id)`);
});

test('addRequestBody', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    methods: ['POST'],
    patterns: ['/foo'],
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
    methods: ['POST'],
    patterns: ['/foo'],
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
    methods: ['POST'],
    patterns: ['/foo'],
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
    methods: ['POST'],
    patterns: ['/foo'],
    headers: [],
    parameters: [
      {
        name: 'myFile',
        type: 'org.springframework.web.multipart.MultipartFile',
        annotations: [{ type: 'org.springframework.web.bind.annotation.RequestParam', attributes: { value: 'hehe' } }],
      },
    ],
    annotations: [],
    returnType: 'java.lang.Long',
  };
  const { code } = new Builder({ ...config, defs: { routes: [foo], classes } });
  expect(code).toContain(`async (myFile: MultipartFile,`);
  expect(code).toContain(`.addMultipartFile('hehe', myFile)`);
});

test('default optional parameters', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    methods: ['POST'],
    patterns: ['/foo'],
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
  expect(code).toContain(`async (a1?: Long, a2?: Long, settings?: Partial<Settings>)`);
});

test('required parameters at first', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    methods: ['POST'],
    patterns: ['/foo'],
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
  expect(code).toContain(`async (a1: Long, a2?: Long, settings?: Partial<Settings>)`);
});

test('required parameters at second', () => {
  const foo = {
    name: 'foo',
    bean: 'test.Demo',
    methods: ['POST'],
    patterns: ['/foo'],
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
  expect(code).toContain(`async (a1: Long | null, a2: Long, settings?: Partial<Settings>)`);
});
