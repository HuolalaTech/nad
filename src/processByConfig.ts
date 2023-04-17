import fs from 'fs';
import axios, { AxiosError } from 'axios';
import type { Writable } from 'stream';
import { Builder, RawDefs } from '@huolala-tech/nad-builder';
import { CodeGen, Root } from '@huolala-tech/nad-builder';
import { green, red, bold } from './ansi';
import { I101, I102, I103, I104, I105 } from './i18n';
import { IO, findVariablePosition, lang } from './utils';
import { Config } from './prepareConfigList';
import { UnexpectedContentType } from './errors';

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

const DEFS_PATH = '/nad/api/defs';

const request = async (url: string) => {
  const config = { headers: {} as Record<string, string>, timeout: 10000 };
  config.headers['Accept-Language'] = [lang, '*'].join(', ');
  config.headers['Accept'] = 'application/json';
  const res = await axios<RawDefs>(url, config);
  UnexpectedContentType.assertJson(res, url);
  return res.data;
};

function fixUrl(url: string) {
  const u = new URL(url);
  if (!u.pathname.endsWith(DEFS_PATH)) {
    u.pathname = u.pathname.replace(/\/*$/, DEFS_PATH);
  }
  return u.toString();
}

const getDefsFromRemote = async (url: string) => {
  const fixedUrl = fixUrl(url);
  try {
    return await request(fixedUrl);
  } catch (error) {
    // Retry with original url, if some errors are received from the fixed url.
    if (fixedUrl !== url) {
      switch (true) {
        case error instanceof AxiosError && !!error.response:
        case error instanceof UnexpectedContentType:
          return await request(url);
      }
    }
    /* istanbul ignore next */
    throw error;
  }
};

export const processByConfig = async (config: Config, io: IO = process) => {
  const { url, output, apis, target } = config;
  const defs = await getDefsFromRemote(url);
  const { root, code } = new Builder({ defs, target, base: url, apis });
  const out = getWritable(output, io);
  out.write(code);
  printBuilderInfo(root, io);
};
