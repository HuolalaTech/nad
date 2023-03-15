import { Builder } from '../../Builder';

const config = { base: 'test', target: 'oc' } as const;

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
  const { code } = new Builder({ target: 'oc', base: '', defs: { routes: [foo], classes } });
  expect(code).toContain(`[req addRequestParam:@"id" value:id];`);
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
  expect(code).toContain(`[req addRequestParam:@"hehe" value:id];`);
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
  expect(code).toContain(`[req addPathVariable:@"id" value:id];`);
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
  expect(code).toContain(`[req addPathVariable:@"hehe" value:id];`);
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
  expect(code).toContain(`[req addRequestBody:people];`);
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
  expect(code).toContain(`[req addNormalParam:people];`);
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
  expect(code).toContain(`[req addMultipartFile:@"myFile" value:myFile];`);
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
  expect(code).toContain(`- (NSNumber*)foo:(NSObject*)myFile`);
  expect(code).toContain(`[req addMultipartFile:@"hehe" value:myFile];`);
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
  expect(code).toContain(`- (NSNumber*)foo:(NSNumber*)a1 a2:(NSNumber*)a2 {`);
});
