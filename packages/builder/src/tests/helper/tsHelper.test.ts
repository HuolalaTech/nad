import { ss } from '../../helpers/tsHelper';

test('ss', () => {
  expect(() => {
    ss(null as unknown as number);
  }).toThrow();
});
