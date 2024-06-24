import { Builder } from '../../Builder';
import { swaggerTestDefs } from '../defs/swaggerTestDefs';

const code = new Builder({ target: 'ts', base: '', defs: swaggerTestDefs }).code;

test('module', () => {
  expect(code).toMatchCode(`
    /**
     * My Module
     * @iface test.Demo
     */
    export const demo = {
  `);
});

test('route', () => {
  expect(code).toMatchCode(`
    /**
     * My Route
     * @param a My A
     * @param b My B
     * @param c My C
     */
    async foo(a?: Long, b?: Long, c?: Long, settings?: Partial<Settings>) {
  `);
});

test('class', () => {
  expect(code).toMatchCode(`
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
  expect(code).toMatchCode(`
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
