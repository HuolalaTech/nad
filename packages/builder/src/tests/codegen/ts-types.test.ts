import { Builder } from '../../Builder';
import { NadClass, NadEnum, NadRoute } from '../../types/nad';
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

test('union type', () => {
  const classes: DeepPartial<NadClass>[] = [
    { name: 'test.U', members: [], innerClasses: ['test.U$A', 'test.U$B'] },
    { name: 'test.U$A', superclass: 'java.lang.Object', members: [], interfaces: ['test.U'] },
    { name: 'test.U$B', superclass: 'java.lang.Object', members: [], interfaces: ['test.U'] },

    { name: 'test.M', members: [], innerClasses: ['test.M$A'] },
    { name: 'test.M$A', superclass: 'java.lang.Object', members: [], interfaces: ['test.M'] },

    { name: 'test.G', members: [], innerClasses: ['test.G$A'], superclass: 'java.lang.Object' },
    { name: 'test.G$A', superclass: 'test.G', members: [] },

    { superclass: 'dirty' },
  ];
  const routes: DeepPartial<NadRoute>[] = [
    { bean: 'test.Foo', name: 'foo1', returnType: 'test.U', parameters: [{ name: 'a', type: 'test.U[]' }] },
    { bean: 'test.Foo', name: 'foo2', returnType: 'test.M', parameters: [{ name: 'a', type: 'test.M[]' }] },
    { bean: 'test.Foo', name: 'foo3', returnType: 'test.G', parameters: [{ name: 'a', type: 'test.G[]' }] },
  ];
  const code = new Builder({ target: 'ts', base: '', defs: { routes, classes } }).code;
  expect(code).toMatchCode(`
    export const foo = {
      /**
       * foo1
       */
      async foo1(a?: Array<UA | UB>, settings?: Partial<Settings>) {
        return new Runtime<UA | UB>()
          .open('POST', '', settings)
          .addRequestParam('a', a)
          .execute();
      },
      /**
       * foo2
       */
      async foo2(a?: M[], settings?: Partial<Settings>) {
        return new Runtime<M>()
          .open('POST', '', settings)
          .addRequestParam('a', a)
          .execute();
      },
      /**
       * foo3
       */
      async foo3(a?: Array<GA | G>, settings?: Partial<Settings>) {
        return new Runtime<GA | G>()
          .open('POST', '', settings)
          .addRequestParam('a', a)
          .execute();
      },
  `);
});

test('narrow type', () => {
  const enums: DeepPartial<NadEnum>[] = [
    {
      name: 'test.Role',
      constants: [
        { name: 'A', value: 0 },
        { name: 'B', value: 1 },
        { name: 'C', value: 2 },
      ],
    },
  ];
  const classes: DeepPartial<NadClass>[] = [
    {
      name: 'test.User',
      members: [
        {
          name: 'role',
          type: 'test.Role',
          annotations: [
            [
              {
                type: 'io.swagger.annotations.ApiModelProperty',
                attributes: {
                  allowableValues: '1,3',
                },
              },
            ],
          ],
        },
      ],
    },
  ];
  const routes: DeepPartial<NadRoute>[] = [{ bean: 'test.FooControlelr', name: 'foo', returnType: 'test.User' }];
  const code = new Builder({ target: 'ts', base: '', defs: { routes, classes, enums } }).code;
  expect(code).toMatchCode(`
    export interface User {
      role?: Extract<Role, 1 | 3>;
    }
  `);
});
