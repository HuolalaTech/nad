import { Class, Enum, Root } from '../../models';
import { User } from '../defs/User';
import { UserType } from '../defs/UserType';

const defs = {
  routes: [
    { bean: 'test.RootControllerA', name: 'foo1', methods: ['GET'], patterns: ['/aa'] },
    { bean: 'test.RootControllerA', name: 'foo2', patterns: ['/first', '/second'] },
    { bean: 'test.RootControllerB', name: 'foo1', methods: ['PUT', 'POST'] },
    { bean: 'test.RootControllerB', name: 'foo2', methods: ['PUT', 'PATCH'], patterns: [] },
  ],
};

test('route groups', () => {
  const root = new Root(defs);
  expect(root.modules).toMatchObject([
    {
      name: 'test.RootControllerA',
      routes: [
        { name: 'foo1', uniqName: 'foo1', method: 'GET', pattern: '/aa' },
        { name: 'foo2', uniqName: 'foo2', method: 'POST', pattern: '/first' },
      ],
    },
    {
      name: 'test.RootControllerB',
      routes: [
        { name: 'foo1', uniqName: 'foo1', method: 'POST', pattern: '' },
        { name: 'foo2', uniqName: 'foo2', method: 'PUT', pattern: '' },
      ],
    },
  ]);
  expect(root.moduleCount).toBe(2);
  expect(root.apiCount).toBe(4);
  expect(root.defCount).toBe(0);
});

test('filter method name', () => {
  const root = new Root(defs, { apis: ['foo1'] });
  expect(root.modules).toMatchObject([
    {
      name: 'test.RootControllerA',
      routes: [{ name: 'foo1', uniqName: 'foo1' }],
    },
    {
      name: 'test.RootControllerB',
      routes: [{ name: 'foo1', uniqName: 'foo1' }],
    },
  ]);
  expect(root.moduleCount).toBe(2);
  expect(root.apiCount).toBe(2);
  expect(root.defCount).toBe(0);
});

test('filter full name', () => {
  const root = new Root(defs, { apis: ['test.RootControllerB.foo1'] });
  expect(root.modules).toMatchObject([
    {
      name: 'test.RootControllerB',
      routes: [{ name: 'foo1', uniqName: 'foo1' }],
    },
  ]);
  expect(root.moduleCount).toBe(1);
  expect(root.apiCount).toBe(1);
  expect(root.defCount).toBe(0);
});

test('defs', () => {
  const root = new Root({ classes: [User], enums: [UserType] });
  
  const getDefBySimpleName = (root: Root, name: string): Enum | Class | null => {
    return (
      root.declarationList.find((def) => def.simpleName === name) ||
      root.enumList.find((def) => def.simpleName === name) ||
      null
    );
  }

  const user = root.getDefByName('test.User');
  expect(root.getDefByName('test.User')).toBe(user); // from cache
  expect(user).toBeInstanceOf(Class);
  if (user) expect(getDefBySimpleName(root, user.simpleName)).toBe(user);

  const userType = root.getDefByName('test.UserType');
  expect(root.getDefByName('test.UserType')).toBe(userType); // from cache
  expect(userType).toBeInstanceOf(Enum);
  if (userType) expect(getDefBySimpleName(root, userType.simpleName)).toBe(userType);

  expect(getDefBySimpleName(root, '')).toBe(null);
});

test('typeMapping', () => {
  const root = new Root(
    { routes: [{ name: 'getFoo', bean: 'test.Test', returnType: 'test.Foo' }] },
    { typeMapping: { 'test.Foo': 'java.util.Map<java.lang.Long, java.lang.String>' } },
  );

  const [module] = root.modules;
  expect(module).toBeDefined();
  const [getFoo] = module.routes;
  expect(getFoo).toBeDefined();
  expect(getFoo.returnType).toMatchObject({
    name: 'java.util.Map',
    parameters: [{ name: 'java.lang.Long' }, { name: 'java.lang.String' }],
  });
  expect(root.declarationList).toHaveLength(0);
});
