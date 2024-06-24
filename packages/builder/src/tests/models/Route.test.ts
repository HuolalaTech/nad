import { Root } from '../../models';

test('overload', () => {
  const root = new Root({
    routes: [
      { bean: 'test.UserController', name: 'getUser', parameters: [{ name: 'id', type: 'java.lang.Long' }] },
      {
        bean: 'test.UserController',
        name: 'getUser',
        parameters: [
          { name: 'name', type: 'java.lang.String' },
          { name: 'type', type: 'java.util.List<java.lang.Integer>' },
        ],
      },
      { bean: 'test.UserController', name: 'getUser' },
    ],
  });

  expect(root.modules).toHaveLength(1);
  const [module] = root.modules;
  expect(module.routes).toHaveLength(3);
  const [gu1, gu2, gu3] = module.routes;
  expect(gu1.uniqName).toBe('getUser');
  expect(gu2.uniqName).toBe('getUserByLong');
  expect(gu3.uniqName).toBe('getUserByStringAndList');
});

test('empty api name', () => {
  const root = new Root({
    routes: [{ bean: 'test.UserController', name: '', parameters: [{ name: 'id', type: 'java.lang.Long' }] }],
  });
  expect(root.modules).toHaveLength(1);
  const [module] = root.modules;
  expect(module.routes).toHaveLength(1);
  const [foo] = module.routes;
  expect(foo.uniqName).toBe('unknownApi');
});

test('bad api name', () => {
  const root = new Root({
    routes: [{ bean: 'test.UserController', name: '$', parameters: [{ name: 'id', type: 'java.lang.Long' }] }],
  });
  expect(root.modules).toHaveLength(1);
  const [module] = root.modules;
  expect(module.routes).toHaveLength(1);
  const [foo] = module.routes;
  expect(foo.uniqName).toBe('unknownApi');
});
