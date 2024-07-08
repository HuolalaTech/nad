import { buildPath } from '../../utils/buildPath';

test('no pattern', () => {
  expect(buildPath('/aaa', { a: 1 })).toBe('/aaa');
});

test('join number', () => {
  expect(buildPath('/aaa/{a}', { a: 1 })).toBe('/aaa/1');
});

test('join boolean', () => {
  expect(buildPath('/aaa/{a}', { a: true })).toBe('/aaa/true');
});

test('join string', () => {
  expect(buildPath('/aaa/{a}', { a: 'hehe' })).toBe('/aaa/hehe');
});

test('with pattern', () => {
  expect(buildPath('/aaa/{a:\\d+}', { a: 123 })).toBe('/aaa/123');
});

test('with pattern and multiple variables', () => {
  expect(buildPath('/aaa/{a}/{b:\\d+}', { a: 123, b: 456 })).toBe('/aaa/123/456');
});

test('both patterns', () => {
  expect(buildPath('/aaa/{a:[a-z]}/{b:\\d+}', { a: 123, b: 456 })).toBe('/aaa/123/456');
});
