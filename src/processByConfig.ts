import fs from 'fs';
import axios from 'axios';
import type { Writable } from 'stream';
import { Builder, RawDefs } from '@huolala-tech/nad-builder';
import { CodeGen, Root } from '@huolala-tech/nad-builder';
import { green, red, bold } from './ansi';
import { I101, I102, I103, I104, I105 } from './i18n';
import { IO, lang } from './utils';
import { Config } from './prepareConfigList';

const findVariablePosition = (line: string) => {
  let pos = 0;
  for (let i = 0; i < line.length; i++) {
    const v = line.charCodeAt(i);
    if (v === 0x1b) break; // break on ANSI start
    // 1: ASCII
    // 2: Other wider character
    pos += v > 0xff ? 2 : 1;
  }
  return pos;
};

const printBuilderInfo = (root: Root, io: IO) => {
  const gen = new CodeGen();
  const firstLine = I101(green(bold(root.moduleCount)));
  gen.write(firstLine);
  gen.indent = ' '.repeat(findVariablePosition(firstLine));
  gen.write(I102(green(bold(root.apiCount))));
  gen.write(I103(green(bold(root.defCount))));
  gen.write(I104(green(bold(root.enumList.length))));
  gen.indent = '';
  if (root.unknownTypes.size) {
    gen.write(I105(red(bold(root.unknownTypes.size))));
    gen.indent += '  - ';
    gen.write(Array.from(root.unknownTypes));
    gen.indent = gen.indent.slice(0, -4);
  }
  gen.write('');
  gen.write('');
  io.stderr.write(gen.toString());
};

export const getWritable = (file: string | undefined, io: IO): Writable => {
  if (typeof file === 'string') return fs.createWriteStream(file);
  return io.stdout;
};

const request = async (url: string) => {
  const headers: Record<string, string> = {};
  headers['Accept-Language'] = [lang, '*'].join(', ');
  const res = await axios<RawDefs>(url, { headers, timeout: 10000 });
  const defs = res.data;
  return defs;
};

export const processByConfig = async (config: Config, io: IO = process) => {
  const { url, output, apis, target } = config;
  const defs = await request(url);
  const { root, code } = new Builder({ defs, target, base: url, apis });
  const out = getWritable(output, io);
  out.write(code);
  printBuilderInfo(root, io);
};
