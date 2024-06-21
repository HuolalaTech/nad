import { Builder } from '../../Builder';
import { mg } from '../test-tools/mg';

test('@deprecated', () => {
  const Deprecated = { type: 'java.lang.Deprecated' };
  const builder = new Builder({
    target: 'ts',
    base: '',
    defs: {
      routes: [{ bean: 'test.FooController', name: 'getFoo', annotations: [Deprecated], returnType: 'test.Foo' }],
      classes: [{ name: 'test.Foo', members: [{ name: 'a', type: 'java.lang.Long', annotations: [[Deprecated]] }] }],
      modules: [{ name: 'test.FooController', annotations: [Deprecated] }],
    },
  });
  const code = builder.code.replace(/\s+/g, ' ');

  expect(code).toContain(mg`
      /**
       * fooController
       * @iface test.FooController
       * @deprecated
       */
      export const fooController = {
        /**
         * getFoo
         * @deprecated
         */
        async getFoo(settings?: Partial<Settings>) {
          return new Runtime<Foo>()
            .open('POST', '', settings)
            .execute();
        },
      };
  `);
});
