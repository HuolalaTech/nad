import { Builder } from '../../Builder';
import { Type } from '../../models';

const { root } = new Builder({ target: 'raw', base: '', defs: {} });

test('java.util.Map<java.lang.String, java.lang.Long>', () => {
  const type = Type.create('java.util.Map<java.lang.String, java.lang.Long>', root);
  expect(type).toBeInstanceOf(Type);
  expect(type).toMatchObject({
    name: 'java.util.Map',
    parameters: [
      { name: 'java.lang.String', parameters: [] },
      { name: 'java.lang.Long', parameters: [] },
    ],
  });
});

test('java.util.List<?>', () => {
  const type = Type.create('java.util.List<?>', root);
  expect(type).toBeInstanceOf(Type);
  expect(type).toMatchObject({
    name: 'java.util.List',
    parameters: [{ name: 'java.lang.Object', parameters: [] }],
  });
});

test('char[]', () => {
  const type = Type.create('char[]', root);
  expect(type).toBeInstanceOf(Type);
  expect(type).toMatchObject({ name: 'java.lang.String', parameters: [] });
});

test('byte[]', () => {
  const type = Type.create('byte[]', root);
  expect(type).toBeInstanceOf(Type);
  expect(type).toMatchObject({ name: 'java.lang.String', parameters: [] });
});

test('int[]', () => {
  const type = Type.create('int[]', root);
  expect(type).toBeInstanceOf(Type);
  expect(type).toMatchObject({ name: 'java.util.List', parameters: [{ name: 'int', parameters: [] }] });
});

test('test.MyClass$$WTF__233', () => {
  const type = Type.create('test.MyClass$$WTF__233', root);
  expect(type).toBeInstanceOf(Type);
  expect(type).toMatchObject({ name: 'test.MyClass$$WTF__233', parameters: [] });
});

test('spaces around', () => {
  const type = Type.create('   java.lang.Long    ', root);
  expect(type).toBeInstanceOf(Type);
  expect(type).toMatchObject({ name: 'java.lang.Long', parameters: [] });
});

test('line feed', () => {
  const type = Type.create(' \n', root);
  expect(type).toBeInstanceOf(Type);
  expect(type).toMatchObject({ name: 'java.lang.Object', parameters: [] });
});

test('empty', () => {
  const type = Type.create('', root);
  expect(type).toBeInstanceOf(Type);
  expect(type).toMatchObject({ name: 'java.lang.Object', parameters: [] });
});

test('toString', () => {
  const type = Type.create('?', root);
  expect(() => {
    type.toString();
  }).toThrow();
});

test('replace', () => {
  const type = Type.create('java.util.Map<K, V>', root);
  expect(type).toBeInstanceOf(Type);
  expect(type).toMatchObject({
    name: 'java.util.Map',
    parameters: [
      { name: 'K', parameters: [] },
      { name: 'V', parameters: [] },
    ],
  });
  const newType = type.replace(
    new Map([
      ['K', Type.create('java.lang.String', root)],
      ['V', Type.create('java.lang.Long', root)],
    ]),
  );
  expect(newType).toMatchObject({
    name: 'java.util.Map',
    parameters: [
      { name: 'java.lang.String', parameters: [] },
      { name: 'java.lang.Long', parameters: [] },
    ],
  });
});

test('get clz', () => {
  const type = Type.create('java.util.Map<K, V>', root);
  expect(type.clz).toBeNull();
});

test('? extends', () => {
  const type = Type.create('java.util.List<? extends test.Foo>', root);
  expect(type.name).toBe('java.util.List');
  expect(type.parameters).toHaveLength(1);
  const [p1] = type.parameters;
  expect(p1.name).toBe('test.Foo');
});

test('? super', () => {
  const type = Type.create('java.util.List<? super test.Foo>', root);
  expect(type.name).toBe('java.util.List');
  expect(type.parameters).toHaveLength(1);
  const [p1] = type.parameters;
  expect(p1.name).toBe('java.lang.Object');
});

test('bad types', () => {
  expect(() => {
    Type.create('java.util.Map<java.lang.Long java.lang.Long>', root);
  }).toThrow(SyntaxError);

  expect(() => {
    Type.create('java.util.Map<java.lang.Long?>', root);
  }).toThrow(SyntaxError);
});
