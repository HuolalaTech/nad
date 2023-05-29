const { env } = process;
delete env.LC_ALL;
delete env.LC_MESSAGES;
delete env.LANG;
delete env.LANGUAGE;

import { lang } from '../../utils';

test('lang', () => {
  expect(lang).toContain('en-US');
});
