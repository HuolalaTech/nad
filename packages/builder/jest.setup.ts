const buildArray = (code: string) => {
  return code.replace(/^(\s*\n)*|(\n\s*)*$/g, '').split(/\n/);
};

const compareIgnoreIndent = (a: string, b: string) => {
  const ta = a.trimStart();
  const tb = b.trimStart();
  if (ta === tb) return [a.length - ta.length, b.length - tb.length];
  return null;
};

expect.extend({
  toMatchCode: function (input, expected) {
    const a = buildArray(input);
    const b = buildArray(expected);
    let maxMatchers: [string, string][] = [];
    a: for (let i = 0; i < a.length; i++) {
      const d = compareIgnoreIndent(a[i], b[0]);
      if (!d) continue;
      const matches: [string, string][] = [];
      for (let j = 1; j < b.length; j++) {
        const fa = a[i + j].slice(d[0]);
        const fb = b[j].slice(d[1]);
        matches.push([fa, fb]);
        if (fa !== fb) {
          if (matches.length > maxMatchers.length) maxMatchers = matches;
          continue a;
        }
      }
      return { pass: true, message: () => 'ok' };
    }
    let diff: string | null = null;
    if (maxMatchers.length === 0) {
      diff = this.utils.diff(input, expected);
    } else {
      diff = this.utils.diff(maxMatchers.map((i) => i[1]).join('\n'), maxMatchers.map((i) => i[0]).join('\n'));
    }
    return { pass: false, message: () => diff || 'Cannot match code' };
  },
});
