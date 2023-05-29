const ansi = (code: string, reset = '0') => {
  return (input: unknown) => {
    if (!process.stderr.isTTY) return String(input);
    /* istanbul ignore next */
    return `\x1B[${code}m${input}\x1B[${reset}m`;
  };
};

export const red = ansi('31');
export const green = ansi('32');
export const yellow = ansi('33');
export const magenta = ansi('35');

export const underline = ansi('4', '24');
export const bold = ansi('1', '22');
