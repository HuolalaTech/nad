import { NadEnum, NadEnumConstant, NadRoute } from '../../types/nad';
import { Builder } from '../../Builder';
import { mg } from '../test-tools/mg';

const config = { base: 'test', target: 'ts' } as const;

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
    export enum MyType {
      WATER = 1,
      FIRE = 2,
    }
  `);
});

test('string enum', () => {
  const code = buildEnum(
    { name: 'WATER', value: 'water', annotations: [], properties: {} },
    { name: 'FIRE', value: 'fire', annotations: [], properties: {} },
  );
  expect(code).toContain(mg`
    export enum MyType {
      WATER = 'water',
      FIRE = 'fire',
    }
  `);
});

test('mixed enum', () => {
  const code = buildEnum(
    { name: 'WATER', value: 'water', annotations: [], properties: {} },
    { name: 'FIRE', value: 1, annotations: [], properties: {} },
  );
  expect(code).toContain(mg`
    export enum MyType {
      WATER = 'WATER',
      FIRE = 'FIRE',
    }
  `);
});

test('enum string includes spetial characters', () => {
  const code = buildEnum(
    { name: 'WATER', value: 'wa\nter', annotations: [], properties: {} },
    { name: 'FIRE', value: 'fi\\re', annotations: [], properties: {} },
  );
  expect(code).toContain(mg`
    export enum MyType {
      WATER = 'wa\\x0ater',
      FIRE = 'fi\\x5cre',
    }
  `);
});
