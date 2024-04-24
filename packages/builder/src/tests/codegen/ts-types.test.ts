import { Builder } from '../../Builder';
import { NadClass, NadRoute } from '../../types/nad';
import { buildTsMethodWithParameters } from '../test-tools/buildMethodWithParameters';
import { mg } from '../test-tools/mg';
import { paginitionDefs } from '../defs/paginitionTestDefs';
import { DeepPartial } from '../../utils';

test('boolean', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsMethodWithParameters({ name: 'a', type });
  expect(code).toContain('async foo(a: boolean,');
});

test('void', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsMethodWithParameters({ name: 'a', type });
  expect(code).toContain('async foo(a: void,');
});

test('java.util.List', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsMethodWithParameters({ name: 'a', type });
  expect(code).toContain('async foo(a?: any[],');
});

test('java.util.List<java.lang.Long>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsMethodWithParameters({ name: 'a', type });
  expect(code).toContain('async foo(a?: Long[],');
});

test('java.util.List<java.lang.Void>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsMethodWithParameters({ name: 'a', type });
  expect(code).toContain('async foo(a?: void[],');
});

test('java.util.Map<java.lang.Long, java.lang.Long>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsMethodWithParameters({ name: 'a', type });
  expect(code).toContain('async foo(a?: Record<Long, Long>,');
});

test('Paginition', () => {
  const code = new Builder({ target: 'ts', base: '', defs: paginitionDefs }).code.replace(/\s+/g, ' ');
  expect(code).toContain('new Runtime<MetaPaginition<Long[]>>');
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

test('Type alias', () => {
  const routes: DeepPartial<NadRoute>[] = [{ bean: 'test.FooModule', name: 'foo', returnType: 'test.B' }];
  const classes: DeepPartial<NadClass>[] = [
    { name: 'test.A', members: [{ name: 'data', type: 'long' }] },
    { name: 'test.B', superclass: 'test.A' },
  ];
  const code = new Builder({ target: 'ts', base: '', defs: { routes, classes } }).code.replace(/\s+/g, ' ');
  expect(code).toContain('new Runtime<B>');
  expect(code).toContain(`export type B = A;`);
  expect(code).toContain(mg`
    export interface A {
      data: Long;
    }
  `);
});

test('special controller name', () => {
  const routes: Partial<NadRoute>[] = [{ bean: 'cn.xxx.xxx.People$$wtf23333', name: 'foo', returnType: 'void' }];
  const code = new Builder({ target: 'ts', base: '', defs: { routes } }).code.replace(/\s+/g, ' ');
  expect(code).toContain(`export const people = {`);
});

test('empty bean', () => {
  const routes: Partial<NadRoute>[] = [{ bean: '', name: 'foo', returnType: 'void' }];
  const code = new Builder({ target: 'ts', base: '', defs: { routes } }).code.replace(/\s+/g, ' ');
  expect(code).toContain(`export const $ = {`);
});
