import { Enum, EnumConstant, Root } from '../../models';

const root = new Root({});

test('number value', () => {
  const obj = new Enum(
    {
      name: 'test.MyEnum',
      constants: [
        { name: 'One', value: 1 },
        { name: 'Two', value: 2 },
      ],
    },
    root,
  );
  expect(obj.constants.length).toBe(2);
  expect(obj.valueType).toBe('number');
  expect(obj.constants[0]).toBeInstanceOf(EnumConstant);
  expect(obj.constants[1]).toBeInstanceOf(EnumConstant);
  expect(obj.constants[0]).toMatchObject({
    owner: obj,
    name: 'One',
    value: 1,
    properties: {},
    memo: '',
  });
  expect(obj.constants[1]).toMatchObject({
    owner: obj,
    name: 'Two',
    value: 2,
    properties: {},
    memo: '',
  });
});

test('string value', () => {
  const obj = new Enum(
    {
      name: 'test.MyEnum',
      constants: [
        { name: 'One', value: '1' },
        { name: 'Two', value: '2' },
      ],
    },
    root,
  );
  expect(obj.constants.length).toBe(2);
  expect(obj.valueType).toBe('string');
  expect(obj.constants[0]).toBeInstanceOf(EnumConstant);
  expect(obj.constants[1]).toBeInstanceOf(EnumConstant);
  expect(obj.constants[0]).toMatchObject({
    owner: obj,
    name: 'One',
    value: '1',
    properties: {},
    memo: '',
  });
  expect(obj.constants[1]).toMatchObject({
    owner: obj,
    name: 'Two',
    value: '2',
    properties: {},
    memo: '',
  });
});

test('mixed value', () => {
  const obj = new Enum(
    {
      name: 'test.MyEnum',
      constants: [
        { name: 'One', value: '1' },
        { name: 'Two', value: 2 },
      ],
    },
    root,
  );
  expect(obj.constants.length).toBe(2);
  expect(obj.valueType).toBe('unknown');
  expect(obj.constants[0]).toBeInstanceOf(EnumConstant);
  expect(obj.constants[1]).toBeInstanceOf(EnumConstant);
  expect(obj.constants[0]).toMatchObject({
    owner: obj,
    name: 'One',
    value: 'One',
    properties: {},
    memo: '',
  });
  expect(obj.constants[1]).toMatchObject({
    owner: obj,
    name: 'Two',
    value: 'Two',
    properties: {},
    memo: '',
  });
});

test('description', () => {
  const obj = new Enum(
    {
      name: 'test.MyEnum',
      annotations: [{ type: 'io.swagger.annotations.ApiModel', attributes: { description: 'hehe' } }],
      constants: [],
    },
    root,
  );
  expect(obj).toMatchObject({
    constants: [],
    valueType: 'unknown',
    description: 'hehe',
  });
});
