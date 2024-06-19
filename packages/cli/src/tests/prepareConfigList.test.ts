import Capacitance from 'capacitance';
import {
  DirIsNotFile,
  FileIsNotJson,
  FileNotFound,
  InvalidTarget,
  InvalidURI,
  MissingField,
  UnknownOption,
} from '../errors';
import { prepareConfigList, program } from '../prepareConfigList';
import { I108 } from '../i18n';

const BASE = 'http://localhost';

afterEach(() => {
  program.reset();
});

test('empty', async () => {
  expect(prepareConfigList([])).rejects.toThrow(FileNotFound);
});

test('FileNotFound', async () => {
  expect(prepareConfigList(['', '', '-c', './notfound'])).rejects.toThrow(FileNotFound);
});

test('FileIsNotJson', async () => {
  expect(prepareConfigList(['', '', '-c', './README.md'])).rejects.toThrow(FileIsNotJson);
});

test('--config', async () => {
  expect(prepareConfigList(['', '', '--config', './README.md'])).rejects.toThrow(FileIsNotJson);
});

test('MissingField', async () => {
  expect(prepareConfigList(['', '', '-c', './package.json'])).rejects.toThrow(MissingField);
});

test('MissingField', async () => {
  expect(prepareConfigList(['', '', '-c'])).rejects.toThrow(FileNotFound);
});

test('UnknownOption', async () => {
  expect(prepareConfigList(['', '', '--hehe'])).rejects.toThrow(UnknownOption);
});

test('no-url', async () => {
  expect(prepareConfigList(['', '', '-c', './src/tests/json/no-url.json'])).rejects.toThrow(MissingField);
});

test('no-target', async () => {
  expect(prepareConfigList(['', '', '-c', './src/tests/json/no-target.json'])).rejects.toThrow(MissingField);
});

test('invalid-url', async () => {
  expect(prepareConfigList(['', '', '-c', './src/tests/json/invalid-url.json'])).rejects.toThrow(InvalidURI);
});

test('invalid-target', async () => {
  expect(prepareConfigList(['', '', '-c', './src/tests/json/invalid-target.json'])).rejects.toThrow(InvalidTarget);
});

test('minimal', async () => {
  expect(prepareConfigList(['', '', '-c', './src/tests/json/minimal.json'])).resolves.toMatchObject([
    { target: 'ts', url: BASE, output: undefined, apis: undefined },
  ]);
});

test('type-mapping', async () => {
  expect(prepareConfigList(['', '', '-c', './src/tests/json/type-mapping.json'])).resolves.toMatchObject([
    {
      target: 'ts',
      url: BASE,
      output: undefined,
      apis: undefined,
      typeMapping: {
        'test.Foo': 'java.util.List<java.lang.Long>',
      },
    },
  ]);
});

test('output', async () => {
  expect(prepareConfigList(['', '', '-c', './src/tests/json/output.json'])).resolves.toMatchObject([
    { target: 'ts', url: BASE, output: 'src/api.ts', apis: undefined },
  ]);
});

test('apis-empty', async () => {
  expect(prepareConfigList(['', '', '-c', './src/tests/json/apis-empty.json'])).resolves.toMatchObject([
    { target: 'ts', url: BASE, apis: [] },
  ]);
});

test('apis', async () => {
  expect(prepareConfigList(['', '', '-c', './src/tests/json/apis.json'])).resolves.toMatchObject([
    { target: 'ts', url: BASE, apis: ['hehe'] },
  ]);
});

test('nad <URL>', async () => {
  expect(prepareConfigList(['', '', BASE])).resolves.toMatchObject([{ target: 'ts', url: BASE }]);
});

test('nad <URL> -t ts', async () => {
  expect(prepareConfigList(['', '', BASE, '-t', 'ts'])).resolves.toMatchObject([{ target: 'ts', url: BASE }]);
});

test('nad <URL> --target oc', async () => {
  expect(prepareConfigList(['', '', BASE, '-t', 'oc'])).resolves.toMatchObject([{ target: 'oc', url: BASE }]);
});

test('nad <URL> --target raw', async () => {
  expect(prepareConfigList(['', '', BASE, '--target', 'raw'])).resolves.toMatchObject([{ target: 'raw', url: BASE }]);
});

test('nad <URL> -t hh', async () => {
  expect(prepareConfigList(['', '', BASE, '-t', 'hh'])).rejects.toThrow(InvalidTarget);
});

test('nad -h', async () => {
  const stdout = new Capacitance();
  const stderr = new Capacitance();
  await prepareConfigList(['', '', '-h'], { stdout, stderr });
  const err = String(await stderr.end());
  expect(err).toContain(' nad ');
});

test('nad empty url', async () => {
  expect(prepareConfigList(['', '', ''])).rejects.toThrow(InvalidURI);
});

test('nad -c .', async () => {
  expect(prepareConfigList(['', '', '-c', '.'])).rejects.toThrow(DirIsNotFile);
});

test('warn', async () => {
  const stdout = new Capacitance();
  const stderr = new Capacitance();
  await prepareConfigList(['', '', '-c', './src/tests/json/minimal.json', '-t', 'oc'], { stdout, stderr });
  const err = String(await stderr.end());
  expect(err).toContain(I108());
});
