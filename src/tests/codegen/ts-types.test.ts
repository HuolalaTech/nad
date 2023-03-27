import { Builder } from '../../Builder';
import { NadClass, NadRoute } from '../../types/nad';
import { buildTsFoo } from '../test-tools/buildFoo';
import { mg } from '../test-tools/mg';

test('boolean', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsFoo({ name: 'a', type, annotations: [] });
  expect(code).toContain('async foo(a: boolean,');
});

test('void', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsFoo({ name: 'a', type, annotations: [] });
  expect(code).toContain('async foo(a: void,');
});

test('java.util.List', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsFoo({ name: 'a', type, annotations: [] });
  expect(code).toContain('async foo(a?: any[],');
});

test('java.util.List<java.lang.Long>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsFoo({ name: 'a', type, annotations: [] });
  expect(code).toContain('async foo(a?: Long[],');
});

test('java.util.List<java.lang.Void>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsFoo({ name: 'a', type, annotations: [] });
  expect(code).toContain('async foo(a?: void[],');
});

test('java.util.Map<java.lang.Long, java.lang.Long>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsFoo({ name: 'a', type, annotations: [] });
  expect(code).toContain('async foo(a?: Record<Long, Long>,');
});

test('Paginition', () => {
  const routes: Partial<NadRoute>[] = [
    {
      bean: 'test.FooModule',
      name: 'foo',
      returnType: 'test.MetaPaginition<java.lang.Long[]>',
    },
  ];
  const classes: Partial<NadClass>[] = [
    {
      name: 'test.Paginition',
      typeParameters: ['T'],
      members: [
        { name: 'data', type: 'T', annotations: [] },
        { name: 'limit', type: 'java.lang.Long', annotations: [] },
        { name: 'offset', type: 'java.lang.Long', annotations: [] },
      ],
    },
    {
      name: 'test.MetaPaginition',
      superclass: 'test.Paginition<T>',
      typeParameters: ['T'],
      members: [{ name: 'meta', type: 'java.lang.Object', annotations: [] }],
    },
  ];
  const code = new Builder({ target: 'ts', base: '', defs: { routes, classes } }).code.replace(/\s+/g, ' ');
  expect(code).toContain('new NadInvoker<MetaPaginition<Long[]>>');
  expect(code).toContain(mg`
    export interface Paginition<T> {
      data?: T;
      limit?: Long;
      offset?: Long;
    }
  `);
  expect(code).toContain(mg`
    export interface MetaPaginition<T> extends Paginition<T> {
      meta?: any;
    }
  `);
});
