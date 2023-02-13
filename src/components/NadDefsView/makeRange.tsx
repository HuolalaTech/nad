import { TextFragmentFinder } from './TextFragmentFinder';

const re = (strs: TemplateStringsArray, ...vars: any[]) => {
  const sb = [];
  for (let i = 0; i < vars.length; i++)
    sb.push(
      strs[i],
      String(vars[i]).replace(
        /\W/g,
        (s) => `\\x${s.charCodeAt(0).toString(16)}`
      )
    );
  sb.push(strs[strs.length - 1]);
  return new RegExp(sb.join(''), 'g');
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
        const fre = re`(?: */\\*(?:(?!\\*/)[\\s\\S])*\\*/\\n)?  async ${methodName}\\([\\s\\S]*?\\n  }`;
        console.log(fre);
        fre.lastIndex = m.index;
        return tff.find(fre);
      }
    } else {
      return tff.find(re`/\\*\\*\\n \\* ${moduleName}\\n[\\s\\S]*?\\n\\}`);
    }
  }
  if (lang === 'oc') {
    if (methodName) {
      const m = re`@interface ${moduleName} :`.exec(tff.textFragment);
      if (m) {
        const fre = re`(?: */\\*(?:(?!\\*/)[\\s\\S])*\\*/\\n)?- \\(.*?\\)${methodName}[;:].*`;
        fre.lastIndex = m.index;
        return tff.find(fre);
      }
    } else {
      return tff.find(re`/\\*\\*\\n \\* ${moduleName}\\n[\\s\\S]*?\\n\\@end`);
    }
  }
};
