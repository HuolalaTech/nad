import { NadInvoker, HttpError } from '..';
import {
  APPLICATION_JSON,
  CONTENT_TYPE,
  MULTIPART_FORM_DATA,
  OCTET_STREAM,
  WWW_FORM_URLENCODED,
} from '@huolala-tech/request';
import { ObjectNestingTooDeepError } from '../errors';
import './libs/mock-xhr';
import { MULTIPART_FORM_DATA_WITH_BOUNDARY } from './libs/mock-xhr';

const base = 'http://localhost';

class Localhost extends NadInvoker<{
  method?: string;
  url?: string;
  headers?: Record<string, string | undefined>;
  files: unknown;
}> {
  public readonly base = base;
}

const helloTxt = new File(['Hello'], 'xx.txt');

describe('basic', () => {
  test('get', async () => {
    const res = await new Localhost().open('GET', '/test').execute();
    expect(res).toMatchObject({
      method: 'GET',
      url: `${base}/test`,
    });
  });

  test('post', async () => {
    const res = await new Localhost().open('POST', '/test').execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test`,
    });
  });

  test('http error', async () => {
    const res = new Localhost()
      .open('POST', '/test')
      .addHeader('response-body', '{"reason":"xswl"}')
      .addHeader('status-code', '500')
      .execute();
    expect(res).rejects.toBeInstanceOf(HttpError);
    expect(res).rejects.toMatchObject({
      statusCode: 500,
      name: 'HttpError',
      headers: { server: 'mock' },
      data: { reason: 'xswl' },
    });
  });

  test('base in settings', async () => {
    const res = await new Localhost().open('POST', '/test', { base: base }).execute();
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
    const res = await new Localhost().open('POST', '/test/{id}').addPathVariable('id', 123).execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test/123`,
    });
  });

  test('string in path', async () => {
    const res = await new Localhost().open('POST', '/test/{id}').addPathVariable('id', '123').execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test/123`,
    });
  });

  test('multiple variables', async () => {
    const res = await new Localhost()
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
    const res = await new Localhost()
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
  test('GET', async () => {
    const res = await new Localhost()
      .open('GET', '/test')
      .addRequestParam('id', 123)
      .addRequestParam('name', 'hehe')
      .addRequestParam('u', undefined)
      .execute();
    expect(res).toMatchObject({
      method: 'GET',
      url: `${base}/test?id=123&name=hehe`,
      headers: {},
    });
  });

  test('POST', async () => {
    const res = await new Localhost()
      .open('POST', '/test')
      .addRequestParam('id', 123)
      .addRequestParam('name', 'hehe')
      .addRequestParam('u', undefined)
      .execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test`,
      data: 'id=123&name=hehe',
      headers: { [CONTENT_TYPE]: WWW_FORM_URLENCODED },
    });
  });

  test('Array', async () => {
    const res = await new Localhost()
      .open('GET', '/test')
      .addRequestParam('before', 'before')
      .addRequestParam('a', [1, 2, 3])
      .addRequestParam('after', 'after')
      .execute();
    expect(res).toMatchObject({
      method: 'GET',
      url: `${base}/test?before=before&a=1&a=2&a=3&after=after`,
    });
  });
});

describe('addStaticParam', () => {
  test('GET', async () => {
    const res = await new Localhost()
      .open('GET', '/test')
      .addStaticParam('action', 'wtf')
      .addRequestParam('name', 'hehe')
      .execute();
    expect(res).toMatchObject({
      method: 'GET',
      url: `${base}/test?action=wtf&name=hehe`,
      headers: {},
    });
  });

  test('POST', async () => {
    const res = await new Localhost()
      .open('POST', '/test')
      .addStaticParam('action', 'wtf')
      .addRequestParam('name', 'hehe')
      .execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test?action=wtf`,
      data: 'name=hehe',
      headers: { [CONTENT_TYPE]: WWW_FORM_URLENCODED },
    });
  });
});

describe('addRequestBody', () => {
  test('json object in body', async () => {
    const res = await new Localhost().open('POST', '/test').addRequestBody({ a: 1 }).execute();
    expect(res).toMatchObject({
      method: 'POST',
      data: { a: 1 },
      url: `${base}/test`,
    });
  });

  test('qs data object in body', async () => {
    const res = await new Localhost()
      .open('POST', '/test', { headers: { [CONTENT_TYPE]: WWW_FORM_URLENCODED } })
      .addRequestBody({ a: 1 })
      .execute();
    expect(res).toMatchObject({
      method: 'POST',
      data: 'a=1',
      url: `${base}/test`,
    });
  });

  test('form data object in body', async () => {
    const res = await new Localhost()
      .open('POST', '/test', { headers: { [CONTENT_TYPE]: MULTIPART_FORM_DATA } })
      .addRequestBody({ a: 1 })
      .execute();
    expect(res).toMatchObject({
      method: 'POST',
      data: { a: '1' },
      url: `${base}/test`,
    });
  });
});

describe('addModelAttribute', () => {
  test('add one object', async () => {
    const res = await new Localhost().open('GET', '/test').addModelAttribute({ a: 1 }).execute();
    expect(res).toMatchObject({
      method: 'GET',
      url: `${base}/test?a=1`,
    });
  });

  test('with file', async () => {
    const res = await new Localhost()
      .open('POST', '/test')
      .addMultipartFile('file', new Blob())
      .addModelAttribute({ a: 1, b: { c: 2 } })
      .execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test`,
      data: { a: '1', 'b.c': '2' },
      files: {
        file: `data:${OCTET_STREAM};base64,`,
      },
    });
  });

  test('with json', async () => {
    const res = await new Localhost()
      .open('POST', '/test')
      .addHeader(CONTENT_TYPE, APPLICATION_JSON)
      .addModelAttribute({ a: 1, b: { c: 2 } })
      .execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test?a=1&b.c=2`,
    });
    expect(res).not.toHaveProperty('data');
  });

  test('add two objects', async () => {
    const res = await new Localhost()
      .open('GET', '/test')
      .addModelAttribute({ a: 1 })
      .addModelAttribute({ b: 2 })
      .execute();
    expect(res).toMatchObject({
      method: 'GET',
      url: `${base}/test?a=1&b=2`,
    });
  });

  test('conflict keys', async () => {
    const res = await new Localhost()
      .open('GET', '/test')
      .addModelAttribute({ a: 1, c: 3 })
      .addModelAttribute({ b: 2, c: 4 })
      .execute();
    expect(res).toMatchObject({
      method: 'GET',
      url: `${base}/test?a=1&c=4&b=2`,
    });
  });

  test('non-object value', async () => {
    const res = await new Localhost()
      .open('GET', '/test')
      .addModelAttribute(undefined)
      .addModelAttribute(null)
      .addModelAttribute([])
      .addModelAttribute({ a: 1 })
      .execute();
    expect(res).toMatchObject({
      method: 'GET',
      url: `${base}/test?a=1`,
    });
  });

  test('nested object', async () => {
    const res = await new Localhost()
      .open('POST', '/test')
      .addModelAttribute({ user: { name: 'hehe', age: 18, v: [1, 2] } })
      .execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test`,
      data: 'user.name=hehe&user.age=18&user.v=1&user.v=2',
      headers: { [CONTENT_TYPE]: WWW_FORM_URLENCODED },
    });
  });

  test('ObjectNestingTooDeepError', async () => {
    const a = { a: new Object() };
    a.a = a;
    expect(() => {
      new Localhost().open('GET', '/test').addModelAttribute(a);
    }).toThrowError(ObjectNestingTooDeepError);
  });
});

describe('addMultipartFile', () => {
  test('add one object', async () => {
    const f1 = new File([], 'xx.txt');
    const res = await new Localhost().open('POST', '/test').addMultipartFile('f1', f1).execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test`,
      files: { f1: `data:${OCTET_STREAM};base64,` },
    });
  });

  test('delete object', async () => {
    const f1 = new File([], 'xx.txt');
    const res = await new Localhost()
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

test('addCustomFlags', async () => {
  class Runtime extends Localhost {
    get flags() {
      return this.customFlags;
    }
  }
  const runtime = new Runtime().open('POST', '/test');
  expect(runtime.flags).toMatchObject([]);
  runtime.addCustomFlags('soa');
  expect(runtime.flags).toMatchObject(['soa']);
  runtime.addCustomFlags('hehe', 'haha');
  expect(runtime.flags).toMatchObject(['soa', 'hehe', 'haha']);
});

describe('static config', () => {
  class A<T> extends NadInvoker<T> {}
  A.base = 'MyBase';
  A.timeout = 5000;
  A.headers = { a: '1' };

  test('pure static config', async () => {
    const res = await new A().open('GET', '/test').execute();
    expect(res).toMatchObject({
      method: 'GET',
      url: `${A.base}/test`,
      timeout: A.timeout,
      headers: A.headers,
    });
  });

  test('over write by settings', async () => {
    const res = await new A()
      .open('GET', '/test', {
        timeout: 8000,
        base: 'Settings',
        headers: { b: '2' },
      })
      .execute();
    expect(res).toMatchObject({
      method: 'GET',
      url: `Settings/test`,
      timeout: 8000,
      headers: { ...A.headers, b: '2' },
    });
  });
});

describe('Nice to use payload', () => {
  test('Explicitly use WWW_FORM_URLENCODED', async () => {
    const res = new Localhost()
      .open('POST', '/test')
      .addRequestParam('a', 1)
      .addHeader(CONTENT_TYPE, WWW_FORM_URLENCODED)
      .execute();
    expect(res).resolves.toMatchObject({
      method: 'POST',
      url: `${base}/test`,
      data: 'a=1',
      headers: { [CONTENT_TYPE]: WWW_FORM_URLENCODED },
    });
  });
  test('Explicitly use MULTIPART_FORM_DATA', async () => {
    const res = await new Localhost()
      .open('POST', '/test')
      .addRequestParam('a', 1)
      .addHeader(CONTENT_TYPE, MULTIPART_FORM_DATA)
      .execute();
    expect(res).toMatchObject({
      method: 'POST',
      url: `${base}/test`,
      data: { a: '1' },
      headers: { [CONTENT_TYPE]: MULTIPART_FORM_DATA_WITH_BOUNDARY },
    });
  });
  test('By default, the WWW_FORM_URLENCODED should be used', async () => {
    const res = new Localhost().open('POST', '/test').addRequestParam('a', 1).execute();
    expect(res).resolves.toMatchObject({
      method: 'POST',
      url: `${base}/test`,
      data: 'a=1',
      headers: { [CONTENT_TYPE]: WWW_FORM_URLENCODED },
    });
  });
});

describe('Assertion', () => {
  test('Attempt to upload file with GET', async () => {
    const res = new Localhost().open('GET', '/test').addMultipartFile('f1', helloTxt).execute();
    expect(res).rejects.toThrow(TypeError);
  });

  test('Attempt to upload file with not multipart/form-data', async () => {
    const res = new Localhost()
      .open('POST', '/test')
      .addHeader(CONTENT_TYPE, APPLICATION_JSON)
      .addMultipartFile('f1', helloTxt)
      .execute();
    expect(res).rejects.toThrow(TypeError);
  });

  test('Attempt to send JSON with GET', async () => {
    const res = new Localhost().open('GET', '/test').addHeader(CONTENT_TYPE, APPLICATION_JSON).execute();
    expect(res).rejects.toThrow(TypeError);
  });
});
