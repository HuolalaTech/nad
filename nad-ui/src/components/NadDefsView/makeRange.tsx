import { TextFragmentFinder } from './TextFragmentFinder';

const re = (strs: TemplateStringsArray, ...vars: any[]) => {
  const sb = [];
  for (let i = 0; i < vars.length; i++) {
    const v = vars[i];
    sb.push(strs[i]);
    if (typeof v === 'string')
      sb.push(v.replace(/\W/g, (s) => `\\x${s.charCodeAt(0).toString(16)}`));
    else sb.push(String(v));
  }
  sb.push(strs[strs.length - 1]);
  return new RegExp(sb.join(''), 'g');
};

const comments = {
  toString() {
    return `/\\*(?:(?!\\*/)[\\s\\S])*\\*/`;
  }
};

export const makeRange = (
  tff: TextFragmentFinder,
  lang: string,
  moduleName: string,
  methodName?: string
) => {
  if (lang === 'ts') {
    if (methodName) {
      const m = re`export const ${moduleName} = \\{`.exec(tff.textFragment);
      if (m) {
        const fre = re`(?:  ${comments}\\n)?  async ${methodName}\\([\\s\\S]*?\\n  }`;
        fre.lastIndex = m.index;
        return tff.find(fre);
      }
    } else {
      return tff.find(
        re`(?:(?<=\n)${comments}\\n)?export const ${moduleName} = [\\s\\S]*?\\n\\};`
      );
    }
  }
  if (lang === 'oc') {
    if (methodName) {
      const m = re`@interface ${moduleName} :`.exec(tff.textFragment);
      if (m) {
        const fre = re`(?: *${comments}\\n)?- \\(.*?\\)${methodName}[;:].*`;
        fre.lastIndex = m.index;
        return tff.find(fre);
      }
    } else {
      return tff.find(
        re`(?:(?<=\n)${comments}\\n)?@interface ${moduleName} :[\\s\\S]*?\\n@end`
      );
    }
  }
};
