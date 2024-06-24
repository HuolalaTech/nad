import http from 'http';
import Capacitance from 'capacitance';
import { AxiosError } from 'axios';
import { Dubious } from '@huolala-tech/nad-builder/dist/cjs/utils';
import { NadResult } from '@huolala-tech/nad-builder/dist/cjs/types/nad';
import { fixUrl, processByConfig } from '../processByConfig';
import { FailedToWrite } from '../errors';
import { u2o } from 'u2x';

const ast: Dubious<NadResult> = {
  classes: [],
  enums: [],
  modules: [],
  routes: [{ name: 'foo', bean: 'demo', methods: ['GET'], patterns: ['/aa'], returnType: 'test.Foo' }],
};

const server = http
  .createServer(async (req, res) => {
    await req.pipe(new Capacitance());
    if (req.url === '/301') {
      res.statusCode = 301;
      res.setHeader('Location', '/nad/api/defs');
      res.end('Redirect to /');
    } else if (req.url === '/500') {
      res.statusCode = 500;
      res.end('500 Internal Error');
    } else if (req.url === '/nad/api/defs') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(ast));
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('404 Not Found');
    }
  })
  .listen();

const { port } = u2o(server.address());

afterAll(() => server.close());

test('basic', async () => {
  const stdout = new Capacitance();
  const stderr = new Capacitance();
  await processByConfig(
    {
      target: 'ts',
      url: `http://127.0.0.1:${port}/nad/api/defs`,
    },
    { stdout, stderr },
  );
  stdout.end();
  stderr.end();
  const out = String(await stdout);
  expect(out).toContain('async foo(settings?: Partial<Settings>)');
  const err = String(await stderr);
  expect(err).toContain(' 1 ');
});

test('404', async () => {
  expect(async () => {
    await processByConfig({
      target: 'ts',
      url: `http://127.0.0.1:${port}/404`,
    });
  }).rejects.toThrow(AxiosError);
});

test('500', async () => {
  expect(async () => {
    await processByConfig({
      target: 'ts',
      url: `http://127.0.0.1:${port}/500`,
    });
  }).rejects.toThrow(AxiosError);
});

test('Write file', async () => {
  const stdout = new Capacitance();
  const stderr = new Capacitance();
  await processByConfig(
    {
      target: 'ts',
      url: `http://127.0.0.1:${port}`,
      output: '/dev/null',
    },
    { stdout, stderr },
  );
  stdout.end();
  stderr.end();
  const out = String(await stdout);
  expect(out).toBe('');
  const err = String(await stderr);
  expect(err).toContain(' 1 ');
});

test('Failed to write file', async () => {
  const stdout = new Capacitance();
  const stderr = new Capacitance();
  expect(async () => {
    await processByConfig(
      {
        target: 'ts',
        url: `http://127.0.0.1:${port}`,
        output: '/',
      },
      { stdout, stderr },
    );
  }).rejects.toThrow(FailedToWrite);
});

test('301', async () => {
  const stdout = new Capacitance();
  const stderr = new Capacitance();
  await processByConfig(
    {
      target: 'ts',
      url: `http://127.0.0.1:${port}/301`,
    },
    { stdout, stderr },
  );
  stdout.end();
  stderr.end();
  const out = String(await stdout);
  expect(out).toContain('async foo(settings?: Partial<Settings>)');
  const err = String(await stderr);
  expect(err).toContain(' 1 ');
});

test('fixUrl', () => {
  const base = 'http://localhost';
  const path = '/nad/api/defs';
  expect(fixUrl(base)).toBe(base + path);
  expect(fixUrl(base + '/')).toBe(base + path);
  expect(fixUrl(base + '/nad')).toBe(base + path);
  expect(fixUrl(base + '/nad/api')).toBe(base + path);
  expect(fixUrl(base + '/nad/api/defs')).toBe(base + path);
  expect(fixUrl(base + '/hehe')).toBe(base + '/hehe' + path);
});
