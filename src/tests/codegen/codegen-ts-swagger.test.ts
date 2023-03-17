import { Enum } from '../../models';
import { Builder } from '../../Builder';
import { UserType } from '../defs/UserType';
import { User } from '../defs/User';

const foo = {
  name: 'foo',
  bean: 'test.Demo',
  methods: ['POST'],
  patterns: ['/foo'],
  headers: [],
  annotations: [{ type: 'io.swagger.annotations.ApiOperation', attributes: { value: 'Demo API' } }],
  parameters: [
    {
      name: 'id',
      type: 'java.lang.Long',
      annotations: [{ type: 'io.swagger.annotations.ApiParam', attributes: { description: 'User ID' } }],
    },
  ],
  returnType: 'test.User',
};

const defs = { routes: [foo], classes: [User], enums: [UserType] };

test('addRequestParam', () => {
  const { root, code } = new Builder({ target: 'ts', base: '', defs });
  expect(root.modules.length).toBe(1);
  const [route] = root.modules;
  expect(route.routes.length).toBe(1);
  const [api] = route.routes;
  expect(api.name).toBe('foo');
  const clz = root.getDefByName('test.UserType');
  expect(clz).toBeInstanceOf(Enum);

  expect(code).toContain(`* @param id User ID`);
  expect(code).toContain(`* demo`);
  expect(code).toContain(`* Demo API`);
  expect(code).toContain(`* Age`);
  expect(code).toContain(`* Name`);
  expect(code).toContain(`export enum UserType`);
  expect(code).toContain(`Admin = 'ADMIN', // desc=The Admin`);
  expect(code).toContain(`Member = 'MEMBER', // desc=The Member`);
});
