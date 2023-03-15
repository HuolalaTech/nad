import { HttpError } from '../errors/HttpError';
import { NadInvoker } from '../NadInvoker';
import './libs/mock-xhr';

const base = 'http://localhost';

describe('basic', () => {
  test('get', async () => {
    const res = await new NadInvoker(base).open('GET', '/test').execute();
    expect(res).toMatchObject({
      method: 'GET',
      url: `${base}/test`,
    });
  });

  test('post', async () => {
    const res = await new NadInvoker(base).open('POST', '/test').execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test`,
    });
  });

  test('http error', async () => {
    const res = new NadInvoker(base).open('POST', '/test').addHeader('status-code', '500').execute();
    expect(res).rejects.toBeInstanceOf(HttpError);
    expect(res).rejects.toMatchObject({ status: 500, name: 'HttpError' });
  });

  test('base in settings', async () => {
    const res = await new NadInvoker().open('POST', '/test', { base: base }).execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test`,
    });
  });

  test('no base provided', async () => {
    const res = await new NadInvoker().open('POST', '/test').execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `/test`,
    });
  });
});

describe('addPathVariable', () => {
  test('number in path', async () => {
    const res = await new NadInvoker(base).open('POST', '/test/{id}').addPathVariable('id', 123).execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test/123`,
    });
  });

  test('string in path', async () => {
    const res = await new NadInvoker(base).open('POST', '/test/{id}').addPathVariable('id', '123').execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test/123`,
    });
  });

  test('multiple variables', async () => {
    const res = await new NadInvoker(base)
      .open('GET', '/test/{id}/{name}')
      .addPathVariable('id', '123')
      .addPathVariable('name', 'hehe')
      .execute();
    expect(res).toMatchObject({
      method: 'GET',
      url: `${base}/test/123/hehe`,
    });
  });

  test('conflict keys', async () => {
    const res = await new NadInvoker(base)
      .open('POST', '/test/{id}')
      .addPathVariable('id', '123')
      .addPathVariable('id', '456')
      .execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test/456`,
    });
  });
});

describe('addRequestParam', () => {
  test('string in qs', async () => {
    const res = await new NadInvoker(base).open('POST', '/test').addRequestParam('id', '123').execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test?id=123`,
    });
  });

  test('string in qs', async () => {
    const res = await new NadInvoker(base).open('POST', '/test').addRequestParam('id', 123).execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test?id=123`,
    });
  });

  test('object in qs', async () => {
    const res = await new NadInvoker(base)
      .open('POST', '/test')
      .addRequestParam('id', {
        toString() {
          return 123;
        },
      })
      .execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test?id=123`,
    });
  });

  test('undefined value', async () => {
    const res = await new NadInvoker(base)
      .open('POST', '/test')
      .addRequestParam('id', 123)
      .addRequestParam('name', undefined)
      .execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test?id=123`,
    });
  });
});

describe('addRequestBody', () => {
  test('json object in body', async () => {
    const res = await new NadInvoker(base).open('POST', '/test').addRequestBody({ a: 1 }).execute();
    expect(res).toMatchObject({
      method: 'POST',
      data: { a: 1 },
      url: `${base}/test`,
    });
  });

  test('qs data object in body', async () => {
    const res = await new NadInvoker(base)
      .open('POST', '/test', { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      .addRequestBody({ a: 1 })
      .execute();
    expect(res).toMatchObject({
      method: 'POST',
      data: 'a=1',
      url: `${base}/test`,
    });
  });

  test('form data object in body', async () => {
    const res = await new NadInvoker(base)
      .open('POST', '/test', { headers: { 'Content-Type': 'multipart/form-data' } })
      .addRequestBody({ a: 1 })
      .execute();
    expect(res).toMatchObject({
      method: 'POST',
      data: { a: '1' },
      url: `${base}/test`,
    });
  });
});

describe('addNormalParam', () => {
  test('add one object', async () => {
    const res = await new NadInvoker(base).open('GET', '/test').addNormalParam({ a: 1 }).execute();
    expect(res).toMatchObject({
      method: 'GET',
      url: `${base}/test?a=1`,
    });
  });
  test('add two objects', async () => {
    const res = await new NadInvoker(base)
      .open('POST', '/test')
      .addNormalParam({ a: 1 })
      .addNormalParam({ b: 2 })
      .execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test?a=1&b=2`,
    });
  });
  test('conflict keys', async () => {
    const res = await new NadInvoker(base)
      .open('POST', '/test')
      .addNormalParam({ a: 1, c: 3 })
      .addNormalParam({ b: 2, c: 4 })
      .execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test?a=1&c=4&b=2`,
    });
  });
  test('undefined value', async () => {
    const res = await new NadInvoker(base)
      .open('POST', '/test')
      .addNormalParam(undefined)
      .addNormalParam(null)
      .addNormalParam({ a: 1 })
      .execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test?a=1`,
    });
  });
});

describe('addMultipartFile', () => {
  test('add one object', async () => {
    const f1 = new File([], 'xx.txt');
    const res = await new NadInvoker(base).open('POST', '/test').addMultipartFile('f1', f1).execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test`,
      files: { f1: 'data:application/octet-stream;base64,' },
    });
  });

  test('delete object', async () => {
    const f1 = new File([], 'xx.txt');
    const res = await new NadInvoker(base)
      .open('POST', '/test')
      .addMultipartFile('f1', f1)
      .addMultipartFile('f1', null)
      .execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test`,
      files: {},
    });
  });
});
