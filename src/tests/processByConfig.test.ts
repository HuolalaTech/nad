import http from 'http';
import Capacitance from 'capacitance';
import { AxiosError } from 'axios';
import { Dubious } from '@huolala-tech/nad-builder/dist/cjs/utils';
import { NadResult } from '@huolala-tech/nad-builder/dist/cjs/types/nad';
import { processByConfig } from '../processByConfig';

const ast: Dubious<NadResult> = {
  classes: [],
  enums: [],
  modules: [],
  routes: [{ name: 'foo', bean: 'demo', methods: ['GET'], patterns: ['/aa'], returnType: 'test.Foo' }],
};

const server = http
  .createServer(async (req, res) => {
    await req.pipe(new Capacitance());
    if (req.url === '/404') {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('404 Not Found');
    } else if (req.url === '/301') {
      res.statusCode = 301;
      res.setHeader('Location', '/');
      res.end('Redirect to /');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(ast));
    }
  })
  .listen();
server.unref();
const { port } = Object(server.address());

test('basic', async () => {
  const stdout = new Capacitance();
  const stderr = new Capacitance();
  await processByConfig(
    {
      target: 'ts',
      url: `http://127.0.0.1:${port}`,
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
  try {
    await processByConfig({
      target: 'ts',
      url: `http://127.0.0.1:${port}/404`,
    });
    fail();
  } catch (error) {
    expect(error).toBeInstanceOf(AxiosError);
  }
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
