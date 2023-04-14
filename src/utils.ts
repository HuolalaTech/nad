import type { Writable } from 'stream';

const { env } = process;
export const lang = (env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE || 'en-US')
  .replace(/_/g, '-')
  .replace(/\..*/, '');

export interface IO {
  stdout: Writable;
  stderr: Writable;
}

export const findVariablePosition = (line: string) => {
  let pos = 0;
  for (let i = 0; i < line.length; i++) {
    const v = line.charCodeAt(i);
    if (v === 0x1b) return pos; // break on ANSI start
    // 1: ASCII
    // 2: Other wider character
    pos += v > 0xff ? 2 : 1;
  }
  return 0;
};
