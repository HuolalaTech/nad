import { isJavaUnknown } from 'src/helpers/javaHelper';
import { Class, Member, Root, Type } from '../../models';

const root = new Root({});

test('generic', () => {
  const clz = new Class(
    {
      name: 'test.MyClass',
      typeParameters: ['K', 'V'],
      members: [
        { name: 'key', type: 'K' },
        { name: 'value', type: 'java.util.List<V>' },
      ],
    },
    root,
  );

  expect(clz.members[0]).toBeInstanceOf(Member);
  expect(clz.members[0].name).toBe('key');
  expect(clz.members[0].type).toBeInstanceOf(Type);
  expect(clz.members[0].type.name).toBe('K');
  expect(clz.members[0].type.isGenericVariable).toBe(true);
  expect(clz.members[0]).toMatchObject({
    name: 'key',
    type: {
      name: 'K',
      parameters: [],
      isGenericVariable: true,
    },
  });

  expect(clz.members[1]).toBeInstanceOf(Member);
  expect(clz.members[1].type).toBeInstanceOf(Type);
  expect(clz.members[1]).toMatchObject({
    name: 'value',
    type: {
      name: 'java.util.List',
      parameters: [{ name: 'V', parameters: [], isGenericVariable: true }],
      isGenericVariable: false,
    },
  });

  expect(clz.name).toBe('test.MyClass');
  expect(clz.simpleName).toBe('MyClass');
  expect(clz.defName).toBe('MyClass<K, V>');
});

test('bad class name', () => {
  const clz = new Class({ name: '$$..' }, root);
  expect(clz.defName).toBe('UnknownClass');
});

test('bad member name', () => {
  const clz = new Class(
    {
      members: [{ name: '$~!@#' }],
    },
    root,
  );

  expect(clz.members).toHaveLength(1);
  const [m1] = clz.members;
  expect(m1.name).toBe('unknownProperty');
});
