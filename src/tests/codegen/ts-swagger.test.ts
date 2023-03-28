import { Builder } from '../../Builder';
import { mg } from '../test-tools/mg';
import { swaggerTestDefs } from '../defs/swaggerTestDefs';

const code = new Builder({ target: 'ts', base: '', defs: swaggerTestDefs }).code.replace(/\s+/g, ' ');

test('module', () => {
  expect(code).toContain(mg`
    /**
     * My Module
     * @iface test.Demo
     */
    export const demo = {
  `);
});

test('route', () => {
  expect(code).toContain(mg`
    /**
     * My Route
     * @param id My ID
     */
    async foo(id?: Long, settings?: Partial<Settings>)
  `);
});

test('class', () => {
  expect(code).toContain(mg`
    /**
     * My Model
     * @iface test.FooModel
     */
    export interface FooModel {
      /**
       * My Field
       */
      type?: FooEnum;
    }
  `);
});

test('enum', () => {
  expect(code).toContain(mg`
    /**
     * My Enum
     */
    export enum FooEnum {
      /**
       * My Type One
       */
      Type1 = 'TYPE1', // desc=My Type1
      /**
       * My Type Two
       */
      Type2 = 'TYPE2', // desc=My Type2
    }
  `);
});
