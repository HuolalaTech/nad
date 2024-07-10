import { Builder } from '../../Builder';
import { swaggerTestDefs } from '../defs/swaggerTestDefs';

const code = new Builder({ target: 'oc', base: '', defs: swaggerTestDefs }).code;

test('module', () => {
  expect(code).toMatchCode(`
    /**
     * My Module
     * @JavaClass test.Demo
     */
    @implementation Demo
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
    - (FooModel*)foo:(NSNumber*)a b:(NSNumber*)b c:(NSNumber*)c;
  `);
});

test('class', () => {
  expect(code).toMatchCode(`
    /**
     * My Model
     * @JavaClass test.FooModel
     */
    @interface FooModel : NSObject
    /**
     * My Field
     */
    @property (nonatomic, assign) FooEnum *type;
    @end
  `);
});

test('enum', () => {
  expect(code).toMatchCode(`
    /**
     * My Enum
     * @JavaClass test.FooEnum
     */
    typedef NSString FooEnum;
    /**
     * My Type One
     */
    const FooEnum *FooEnum_Type1 = @"TYPE1"; // desc=My Type1
    /**
     * My Type Two
     */
    const FooEnum *FooEnum_Type2 = @"TYPE2"; // desc=My Type2
  `);
});
