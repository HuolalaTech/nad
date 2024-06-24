import fs from 'fs';
import { I108, I100 } from './i18n';
import { Program, Option } from './commander';
import { yellow } from './ansi';
import { FileNotFound } from './errors/FileNotFound';
import { InvalidTarget, FileIsNotJson, MissingField, InvalidURI, DirIsNotFile } from './errors';
import { IO } from './utils';
import { u2o, u2s } from 'u2x';

const supportedTarget = ['ts', 'oc', 'raw'] as const;
export type ConfigTarget = (typeof supportedTarget)[number];
const isConfigTarget = (u: unknown): u is ConfigTarget => supportedTarget.includes(u as ConfigTarget);

export const program = new Program({
  config: new Option(String),
  get c() {
    return this.config;
  },
  target: new Option((s) => {
    if (isConfigTarget(s)) return s;
    throw new InvalidTarget(s);
  }),
  get t() {
    return this.target;
  },
  output: new Option(String),
  get o() {
    return this.output;
  },
  help: new Option(() => true),
  get h() {
    return this.help;
  },
});

export interface Config {
  target: ConfigTarget;
  url: string;
  output?: string;
  apis?: string[];
  typeMapping?: Record<string, string>;
}

const isURI = (s: unknown): s is string => {
  if (typeof s !== 'string' || s === '') return false;
  return true;
  // return /^(https?:)?\/\/|/.test(s);
};

const parseConfig = (config: unknown) => {
  const { target, url, output, apis, typeMapping } = u2o(config);
  if (url === undefined) throw new MissingField('url');
  if (target === undefined) throw new MissingField('target');
  if (!isConfigTarget(target)) throw new InvalidTarget(target);
  if (!isURI(url)) throw new InvalidURI(url);
  return {
    target,
    url,
    output: u2s(output),
    apis: apis instanceof Array ? apis.map((i) => u2s(i)).filter((i): i is string => !!i) : undefined,
    typeMapping: typeMapping ? Object.assign(Object.create(null), typeMapping) : undefined,
  };
};

const loadConfigFile = (path: string, io: IO): Config[] => {
  const target = program.getOption('target');
  if (typeof target === 'string' || program.args.length) io.stderr.write(yellow(I108()) + '\n');
  let obj;
  try {
    fs.accessSync(path);
    const rawConfig = fs.readFileSync(path);
    obj = JSON.parse(rawConfig.toString());
  } catch (error) {
    if (error && typeof error === 'object') {
      const { code, name } = u2o(error);
      if (code === 'ENOENT') throw new FileNotFound(path);
      if (code === 'EISDIR') throw new DirIsNotFile(path);
      if (name === 'SyntaxError') throw new FileIsNotJson(path);
      /* istanbul ignore next */
      throw error;
    }
    /* istanbul ignore next */
    throw new Error('Unknown exception ' + error);
  }
  return [].concat(obj).map(parseConfig);
};

export const prepareConfigList = async (argv: readonly string[], io: IO = process): Promise<Config[]> => {
  program.build(argv);

  if (program.getOption('help')) {
    io.stderr.write(I100().trim());
    io.stderr.write('\n\n');
    return [];
  }

  const config = program.getOption('config');

  if (typeof config === 'string') {
    return loadConfigFile(config || './nad.config.json', io);
  }

  if (program.args.length === 0) {
    return loadConfigFile('./nad.config.json', io);
  }

  const output = program.getOption('output');
  const target = program.getOption('target') || 'ts';
  const url = program.args[0];
  return [parseConfig({ target, url, output })];
};
