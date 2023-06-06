import highlight from 'highlight.js';
import tsConfig from 'highlight.js/lib/languages/typescript';
import ocConfig from 'highlight.js/lib/languages/objectivec';

import 'highlight.js/scss/github.scss';

highlight.registerLanguage('ts', tsConfig);
highlight.registerLanguage('oc', ocConfig);

export const hl = (code: string, language: string): string => {
  return highlight.highlight(code, { language }).value;
};
