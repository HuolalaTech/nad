import { UniqueName } from '../../utils';

test('basic', () => {
  const o = {};
  expect(UniqueName.lookupFor(o, 'a')).toBeFalsy();
  expect(UniqueName.createFor(o, 'a')).toBe('a');
  expect(UniqueName.lookupFor(o, 'a')).toBeTruthy();
  expect(UniqueName.createFor(o, 'a')).toBe('a$1');
  expect(UniqueName.createFor(o, 'a')).toBe('a$2');
  expect(UniqueName.createFor(o, 'b')).toBe('b');
  expect(UniqueName.createFor(o, 'b')).toBe('b$1');
  expect(UniqueName.createFor(o, 'b')).toBe('b$2');
});

test('custom seprator', () => {
  const o = {};
  expect(UniqueName.createFor(o, 'a', '_')).toBe('a');
  expect(UniqueName.createFor(o, 'a', '_')).toBe('a_1');
  expect(UniqueName.createFor(o, 'a', '_')).toBe('a_2');
});

test('different target', () => {
  const a = {};
  const b = {};
  expect(UniqueName.createFor(a, 'a')).toBe('a');
  expect(UniqueName.createFor(a, 'a')).toBe('a$1');
  expect(UniqueName.createFor(a, 'a')).toBe('a$2');
  expect(UniqueName.createFor(b, 'a')).toBe('a');
  expect(UniqueName.createFor(b, 'a')).toBe('a$1');
  expect(UniqueName.createFor(b, 'a')).toBe('a$2');
});

test('overflow', () => {
  const o = {};
  expect(() => {
    for (let i = 0; i < 100; i++) UniqueName.createFor(o, 'a');
  }).not.toThrowError();
  expect(() => {
    for (let i = 0; i < 100; i++) UniqueName.createFor(o, 'b');
    UniqueName.createFor(o, 'b');
  }).toThrowError();
});
