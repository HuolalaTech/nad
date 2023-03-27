import { NadEnum, NadEnumConstant, NadRoute } from '../../types/nad';
import { Builder } from '../../Builder';
import { mg } from '../test-tools/mg';

const config = { base: 'test', target: 'oc' } as const;

const buildEnum = (...constants: NadEnumConstant<unknown>[]) => {
  const foo: Partial<NadRoute> = {
    name: 'foo',
    bean: 'test.Demo',
    parameters: [],
    returnType: 'test.MyType',
  };

  const MyType: Partial<NadEnum> = {
    name: 'test.MyType',
    constants,
  };

  return new Builder({
    ...config,
    defs: { routes: [foo], enums: [MyType] },
  }).code.replace(/\s+/g, ' ');
};

test('number enum', () => {
  const code = buildEnum(
    { name: 'WATER', value: 1, annotations: [], properties: {} },
    { name: 'FIRE', value: 2, annotations: [], properties: {} },
  );
  expect(code).toContain(mg`
    typedef NSNumber MyType;
    const MyType *MyType_WATER = @1;
    const MyType *MyType_FIRE = @2;
  `);
});

test('string enum', () => {
  const code = buildEnum(
    { name: 'WATER', value: 'water', annotations: [], properties: {} },
    { name: 'FIRE', value: 'fire', annotations: [], properties: {} },
  );
  expect(code).toContain(mg`
    typedef NSString MyType;
    const MyType *MyType_WATER = @"water";
    const MyType *MyType_FIRE = @"fire";
  `);
});

test('mixed enum', () => {
  const code = buildEnum(
    { name: 'WATER', value: 'water', annotations: [], properties: {} },
    { name: 'FIRE', value: 1, annotations: [], properties: {} },
  );
  expect(code).toContain(mg`
    typedef NSObject MyType;
    const MyType *MyType_WATER = @"WATER";
    const MyType *MyType_FIRE = @"FIRE";
  `);
});

test('enum string includes spetial characters', () => {
  const code = buildEnum(
    { name: 'WATER', value: 'wa\nter', annotations: [], properties: {} },
    { name: 'FIRE', value: 'fi\\re', annotations: [], properties: {} },
  );
  expect(code).toContain(mg`
    typedef NSString MyType;
    const MyType *MyType_WATER = @"wa\\x0ater";
    const MyType *MyType_FIRE = @"fi\\x5cre";
  `);
});
