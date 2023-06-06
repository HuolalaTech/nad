process.env.LC_ALL = 'ja-JP';

import { lang } from '../../utils';
import { I100 } from '../../i18n';

test('lang', () => {
  expect(lang).toContain('ja-JP');
});

test('i18n', () => {
  expect(I100()).toContain('Usage:');
});
