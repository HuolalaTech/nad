import { ss } from '../../helpers/ocHelper';

test('ss', () => {
  expect(() => {
    ss(null as unknown as number);
  }).toThrowError();
});
