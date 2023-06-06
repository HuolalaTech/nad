import { getTemplateByType, i18n } from '../i18n';

const I0 = i18n<1>({
  zh: 'There $1<is,are> $1 $1<apple,apples>',
  en: 'There $1<is,are> $1 $1<apple,apples>',
});

test('singular', () => {
  expect(I0(1)).toBe('There is 1 apple');
});

test('plural', () => {
  expect(I0(2)).toBe('There are 2 apples');
});

test('getTemplateByType', () => {
  const desc = { zh: 'zh', en: 'en' };
  expect(getTemplateByType(desc, 'zh')).toBe('zh');
  expect(getTemplateByType(desc, 'en')).toBe('en');
  expect(getTemplateByType(desc, 'xx')).toBe('en');
});
