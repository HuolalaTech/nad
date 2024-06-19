import fs from 'fs';
import axios, { AxiosError } from 'axios';
import { Writable, Readable } from 'stream';
import { Builder, RawDefs } from '@huolala-tech/nad-builder';
import { CodeGen, Root } from '@huolala-tech/nad-builder';
import { green, red, bold } from './ansi';
import { I101, I102, I103, I104, I105 } from './i18n';
import { IO, findVariablePosition, lang } from './utils';
import { Config } from './prepareConfigList';
import { FailedToWrite, UnexpectedContentType } from './errors';

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

const request = async (url: string) => {
  const config = { headers: {} as Record<string, string>, timeout: 10000 };
  config.headers['Accept-Language'] = [lang, '*'].join(', ');
  config.headers['Accept'] = 'application/json';
  const res = await axios<RawDefs>(url, config);
  UnexpectedContentType.assertJson(res, url);
  return res.data;
};

const DEFS_PATH = '/nad/api/defs';
export function fixUrl(url: string) {
  const u = new URL(url);
  u.pathname = u.pathname.replace(/((\/nad(\/api(\/defs)?)?)?|\/*)$/, DEFS_PATH);
  return u.toString();
}

const isRemoteURL = (s: unknown): s is string => {
  return typeof s === 'string' && /^(https?:)?\/\//.test(s);
};

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

export const getJsonResource = async (url: string) => {
  if (isRemoteURL(url)) return getDefsFromRemote(url);
  const input: Readable = url === '-' ? process.stdin : fs.createReadStream(url);
  return new Promise<RawDefs>((resolve, reject) => {
    const buffers: Buffer[] = [];
    input.on('data', (data) => buffers.push(data));
    input.on('error', reject);
    input.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(buffers).toString('utf-8')));
      } catch (error) {
        reject(error);
      }
    });
  });
};

const createWriteStream = (path: string) =>
  new Promise<Writable>((resolve, reject) => {
    const out = fs.createWriteStream(path);
    out.on('open', () => resolve(out));
    out.on('error', reject);
  }).catch((error) => {
    throw FailedToWrite.wrap(error, path);
  });

export const processByConfig = async (config: Config, io: IO = process) => {
  const { url, output, target, apis, typeMapping } = config;
  const defs = await getJsonResource(url);
  const { root, code } = new Builder({ defs, target, base: url, apis, typeMapping });
  const out = output ? await createWriteStream(output) : io.stdout;
  out.write(code);
  printBuilderInfo(root, io);
};
