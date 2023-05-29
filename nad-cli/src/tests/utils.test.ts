import { findVariablePosition } from '../utils';

test('findVariablePosition', () => {
  expect(findVariablePosition('abc \x1b')).toBe(4);
  expect(findVariablePosition('zzzz \x1b')).toBe(5);
  expect(findVariablePosition('中文 \x1b')).toBe(5);
  // No variables
  expect(findVariablePosition('123456')).toBe(0);
  expect(findVariablePosition('中文ceshi')).toBe(0);
});
