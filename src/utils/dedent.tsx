export const dedent = (
  template: { raw: readonly string[] | ArrayLike<string> },
  ...substitutions: any[]
) => {
  const { raw } = template;
  let sb = '';
  for (let i = 0; i < raw.length; i++) {
    if (i) sb += substitutions[i - 1];
    sb += raw[i];
  }
  const list = sb.split(/\n/g);
  const a = list
    .map((i) => i.match(/^ *(?=\S)/)?.[0].length)
    .filter((i): i is number => typeof i === 'number');
  const min = Math.min(...a);
  return list.map((i) => i.slice(min)).join('\n');
};
