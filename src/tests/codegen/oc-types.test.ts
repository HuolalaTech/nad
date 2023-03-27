import { Builder } from '../../Builder';
import { NadClass, NadRoute } from '../../types/nad';
import { buildOcFoo } from '../test-tools/buildFoo';
import { mg } from '../test-tools/mg';

test('boolean', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildOcFoo({ name: 'a', type, annotations: [] });
  expect(code).toContain('- (NSNumber*)foo:(NSNumber*)a;');
});

test('void', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildOcFoo({ name: 'a', type, annotations: [] });
  expect(code).toContain('- (NSNumber*)foo:(void*)a;');
});

test('java.util.List', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildOcFoo({ name: 'a', type, annotations: [] });
  expect(code).toContain('- (NSNumber*)foo:(NSArray<NSObject*>*)a;');
});

test('java.util.List<java.lang.Long>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildOcFoo({ name: 'a', type, annotations: [] });
  expect(code).toContain('- (NSNumber*)foo:(NSArray<NSNumber*>*)a;');
});

test('java.util.List<java.lang.Void>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildOcFoo({ name: 'a', type, annotations: [] });
  expect(code).toContain('- (NSNumber*)foo:(NSArray<void*>*)a;');
});

test('java.util.Map<java.lang.Long, java.lang.Long>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildOcFoo({ name: 'a', type, annotations: [] });
  expect(code).toContain('- (NSNumber*)foo:(NSDictionary*)a;');
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
  const code = new Builder({ target: 'oc', base: '', defs: { routes, classes } }).code.replace(/\s+/g, ' ');
  expect(code).toContain(`- (MetaPaginition<NSArray<NSNumber*>*>*)foo;`);
  expect(code).toContain(mg`
    @interface Paginition<T> : NSObject
    @property (nonatomic, assign) T data;
    @property (nonatomic, assign) NSNumber *limit;
    @property (nonatomic, assign) NSNumber *offset;
    @end
  `);
  expect(code).toContain(mg`
    @interface MetaPaginition<T> : Paginition<T>
    @property (nonatomic, assign) NSObject *meta;
    @end
  `);
});
