import { Enum } from '../models';
import { Builder } from '../Builder';

const classes = [
  {
    name: 'test.People',
    annotations: [{ type: 'io.swagger.annotations.ApiModel', attributes: { value: 'People' } }],
    members: [
      {
        annotations: [{ type: 'io.swagger.annotations.ApiModelProperty', attributes: { value: 'Name' } }],
        name: 'name',
        type: 'java.lang.String',
      },
      {
        annotations: [{ type: 'io.swagger.annotations.ApiModelProperty', attributes: { name: 'Age' } }],
        name: 'age',
        type: 'int',
      },
      {
        annotations: [{ type: 'io.swagger.annotations.ApiModelProperty', attributes: {} }],
        name: 'memo',
        type: 'test.PeopleType',
      },
    ],
    superclass: 'java.lang.Object',
  },
];

const enums = [
  {
    name: 'test.PeopleType',
    constants: [
      { name: 'Admin', value: 'ADMIN', properties: { desc: 'The Admin' } },
      { name: 'Member', value: 'MEMBER', properties: { desc: 'The Member' } },
    ],
  },
];

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
  annotations: [{ type: 'io.swagger.annotations.ApiOperation', attributes: { value: 'Demo' } }],
  returnType: 'test.People',
};

const defs = { routes: [foo], classes, enums };

test('addRequestParam', () => {
  const { root, code } = new Builder({ target: 'ts', base: '', defs });
  expect(root.routes.length).toBe(1);
  const [route] = root.routes;
  expect(route.apis.length).toBe(1);
  const [api] = route.apis;
  expect(api.name).toBe('foo');
  const clz = root.getDefByName('test.PeopleType');
  expect(clz).toBeInstanceOf(Enum);

  expect(code).toContain(`* demo`);
  expect(code).toContain(`* Demo`);
  expect(code).toContain(`* Age`);
  expect(code).toContain(`* Name`);
  expect(code).toContain(`export enum PeopleType`);
  expect(code).toContain(`Admin = 'ADMIN', // desc=The Admin`);
  expect(code).toContain(`Member = 'MEMBER', // desc=The Member`);
});
