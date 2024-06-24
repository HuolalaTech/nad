import { NadEnum, NadEnumConstant, NadRoute } from '../../types/nad';
import { Builder } from '../../Builder';
import { mg } from '../test-tools/mg';
import { DeepPartial } from '../../utils';

const config = { base: 'test', target: 'ts' } as const;

const buildEnum = (...constants: DeepPartial<NadEnumConstant>[]) => {
  const foo: Partial<NadRoute> = {
    name: 'foo',
    bean: 'test.Demo',
    parameters: [],
    returnType: 'test.MyType',
  };

  const MyType: DeepPartial<NadEnum> = {
    name: 'test.MyType',
    constants,
  };

  return new Builder({
    ...config,
    defs: { routes: [foo], enums: [MyType] },
  }).code.replace(/\s+/g, ' ');
};

test('iota enum from zero', () => {
  const code = buildEnum({ name: 'WATER', value: 0 }, { name: 'FIRE', value: 1 });
  expect(code).toContain(mg`
    export enum MyType {
      WATER,
      FIRE,
    }
  `);
});

test('iota enum from 1', () => {
  const code = buildEnum({ name: 'WATER', value: 1 }, { name: 'FIRE', value: 2 });
  expect(code).toContain(mg`
    export enum MyType {
      WATER = 1,
      FIRE,
    }
  `);
});

test('string enum', () => {
  const code = buildEnum({ name: 'WATER', value: 'water' }, { name: 'FIRE', value: 'fire' });
  expect(code).toContain(mg`
    export enum MyType {
      WATER = 'water',
      FIRE = 'fire',
    }
  `);
});

test('mixed enum', () => {
  const code = buildEnum({ name: 'WATER', value: 'water' }, { name: 'FIRE', value: 1 });
  expect(code).toContain(mg`
    export enum MyType {
      WATER = 'WATER',
      FIRE = 'FIRE',
    }
  `);
});

test('enum string includes spetial characters', () => {
  const code = buildEnum({ name: 'WATER', value: 'wa\nter' }, { name: 'FIRE', value: 'fi\\re' });
  expect(code).toContain(mg`
    export enum MyType {
      WATER = 'wa\\x0ater',
      FIRE = 'fi\\x5cre',
    }
  `);
});
