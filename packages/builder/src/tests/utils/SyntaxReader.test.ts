import { SyntaxReader } from '../../utils/SyntaxReader';

test('single char', () => {
  const sr = new SyntaxReader('abc');
  expect(sr.read('c')).toBe('');
  expect(sr.read('b')).toBe('');
  expect(sr.read('a')).toBe('a');
  expect(sr.read('b')).toBe('b');
  expect(sr.read('c')).toBe('c');
});

test('string', () => {
  const sr = new SyntaxReader('abc');
  expect(sr.read('ab')).toBe('ab');
  expect(sr.read('bc')).toBe('');
  expect(sr.read('c')).toBe('c');
});

test('pattern', () => {
  const sr = new SyntaxReader('abc');
  expect(sr.read(/z/g)).toBe('');
  expect(sr.read(/c/g)).toBe('');
  expect(sr.read(/.b/g)).toBe('ab');
  expect(sr.read(/./g)).toBe('c');
});

test('global flag', () => {
  const sr = new SyntaxReader('abc');
  expect(() => {
    sr.read(/a/);
  }).toThrow(TypeError);
});

test('never', () => {
  const sr = new SyntaxReader('abc');
  expect(() => {
    sr.read(1 as unknown as string);
  }).toThrow();
});
