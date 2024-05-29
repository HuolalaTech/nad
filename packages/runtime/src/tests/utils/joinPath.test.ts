import { joinPath } from '../../utils/joinPath';

test('basic', () => {
  expect(joinPath('aaa', 'bbb')).toBe('aaa/bbb');
});

test('tailing slash in left', () => {
  expect(joinPath('aaa/', 'bbb')).toBe('aaa/bbb');
});

test('leading slash in right', () => {
  expect(joinPath('aaa', '/bbb')).toBe('aaa/bbb');
});

test('both slashes', () => {
  expect(joinPath('aaa/', '/bbb')).toBe('aaa/bbb');
});

test('relative path in right', () => {
  expect(joinPath('aaa/', './././././bbb')).toBe('aaa/bbb');
});

test('multiple slashes in right', () => {
  expect(joinPath('aaa/', '////bbb')).toBe('aaa/bbb');
});

test('wtf in right', () => {
  expect(joinPath('aaa/', '//.//bbb')).toBe('aaa/bbb');
});

test('http:// in left', () => {
  expect(joinPath('http://localhost/', '/api')).toBe('http://localhost/api');
});

test('empty base 1', () => {
  expect(joinPath('', 'api')).toBe('/api');
});

test('empty base 2', () => {
  expect(joinPath('', '/api')).toBe('/api');
});

test('empty base 3', () => {
  expect(joinPath('', './api')).toBe('/api');
});
