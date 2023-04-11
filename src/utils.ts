import type { Writable } from 'stream';

const { env } = process;
export const lang = (env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE || 'en-US')
  .replace(/_/g, '-')
  .replace(/\..*/, '');

export interface IO {
  stdout: Writable;
  stderr: Writable;
}
