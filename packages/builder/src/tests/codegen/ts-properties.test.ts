import { Builder } from '../../Builder';

test('properties', () => {
  const defs = { routes: [], classes: [], enums: [] };
  const { code } = new Builder({ target: 'ts', base: '', defs, properties: { a: 1, b: '2' } });
  const c = code.replace(/\s+/g, ' ');
  expect(c).toContain(
    `export class Runtime<T = unknown> extends NadInvoker<T> {
       public static base = '';
       public static a = 1;
       public static b = '2';
     }`.replace(/\s+/g, ' '),
  );
});
