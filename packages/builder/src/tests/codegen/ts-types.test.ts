import { Builder } from '../../Builder';
import { NadClass, NadRoute } from '../../types/nad';
import { paginitionDefs } from '../defs/paginitionTestDefs';
import { DeepPartial } from '../../utils';

test('Paginition', () => {
  const code = new Builder({ target: 'ts', base: '', defs: paginitionDefs }).code;
  expect(code).toMatchCode('return new Runtime<MetaPaginition<Long[]>>()');
  expect(code).toMatchCode(`
    export interface Paginition<T> {
      data?: T;
      limit?: Long;
      offset?: Long;
    }
  `);
  expect(code).toMatchCode(`
    export interface MetaPaginition<T> extends Paginition<T> {
      meta?: unknown;
    }
  `);
});

test('Type alias', () => {
  const routes: DeepPartial<NadRoute>[] = [{ bean: 'test.FooModule', name: 'foo', returnType: 'test.B' }];
  const classes: DeepPartial<NadClass>[] = [
    { name: 'test.A', members: [{ name: 'data', type: 'long' }] },
    { name: 'test.B', superclass: 'test.A' },
  ];
  const code = new Builder({ target: 'ts', base: '', defs: { routes, classes } }).code;
  expect(code).toMatchCode('return new Runtime<B>()');
  expect(code).toMatchCode(`export type B = A;`);
  expect(code).toMatchCode(`
    export interface A {
      data: Long;
    }
  `);
});

test('special controller name', () => {
  const routes: Partial<NadRoute>[] = [
    { bean: 'cn.xxx.xxx.People$$EnhancerByCGLIB$$wtf23333', name: 'foo', returnType: 'void' },
  ];
  const code = new Builder({ target: 'ts', base: '', defs: { routes } }).code;
  expect(code).toMatchCode(`export const people = {`);
});

test('empty bean', () => {
  const routes: Partial<NadRoute>[] = [{ bean: '', name: 'foo', returnType: 'void' }];
  const code = new Builder({ target: 'ts', base: '', defs: { routes } }).code;
  expect(code).toMatchCode(`export const unknownModule = {`);
});
