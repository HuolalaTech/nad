import { DeepPartial } from '../../utils';
import { NadAnnotation } from '../../types/nad';
import { buildTsFoo } from '../test-tools/buildFoo';

const buildA = (...annotations: DeepPartial<NadAnnotation>[]) => {
  return buildTsFoo({ name: 'id', type: 'java.lang.Long', annotations });
};

describe.each([
  ['org.springframework.web.bind.annotation.PathVariable', 'addPathVariable'],
  ['org.springframework.web.bind.annotation.RequestParam', 'addRequestParam'],
  ['org.springframework.web.bind.annotation.RequestHeader', 'addHeader'],
])('%p', (type, method) => {
  test('basic', () => {
    const code = buildA({ type });
    expect(code).toContain(`async foo(id: Long, settings?: Partial<Settings>)`);
    expect(code).toContain(`.${method}('id', id)`);
  });

  test('rename with value', () => {
    const code = buildA({ type, attributes: { value: 'x' } });
    expect(code).toContain(`async foo(id: Long, settings?: Partial<Settings>)`);
    expect(code).toContain(`.${method}('x', id)`);
  });

  test('rename', () => {
    const code = buildA({ type, attributes: { name: 'x' } });
    expect(code).toContain(`async foo(id: Long, settings?: Partial<Settings>)`);
    expect(code).toContain(`.${method}('x', id)`);
  });

  test('optional', () => {
    const code = buildA({ type, attributes: { required: false } });
    expect(code).toContain(`async foo(id?: Long, settings?: Partial<Settings>)`);
    expect(code).toContain(`.${method}('id', id)`);
  });
});

describe.each([['org.springframework.web.bind.annotation.RequestParam', 'addRequestParam']])('%p', (_, method) => {
  test('auto', () => {
    const code = buildA();
    expect(code).toContain(`async foo(id?: Long, settings?: Partial<Settings>)`);
    expect(code).toContain(`.${method}('id', id)`);
  });
});

describe.each([['org.springframework.web.bind.annotation.ModelAttribute', 'addModelAttribute']])(
  '%p',
  (type, method) => {
    const user = { name: 'user', type: 'test.User' };
    test('default', () => {
      const code = buildTsFoo({ ...user, annotations: [{ type }] });
      expect(code).toContain(`async foo(user?: User, settings?: Partial<Settings>)`);
      expect(code).toContain(`.${method}(user)`);
    });

    test('auto', () => {
      const code = buildTsFoo(user);
      expect(code).toContain(`.${method}(user)`);
    });
  },
);

describe.each([['org.springframework.web.bind.annotation.RequestBody', 'addRequestBody']])('%p', (type, method) => {
  const user = { name: 'user', type: 'test.User' };
  test('default', () => {
    const code = buildTsFoo({ ...user, annotations: [{ type }] });
    expect(code).toContain(`async foo(user: User, settings?: Partial<Settings>)`);
    expect(code).toContain(`.${method}(user)`);
  });

  test('optional', () => {
    const code = buildTsFoo({ ...user, annotations: [{ type, attributes: { required: false } }] });
    expect(code).toContain(`async foo(user?: User, settings?: Partial<Settings>)`);
    expect(code).toContain(`.${method}(user)`);
  });
});

describe.each([['org.springframework.web.multipart.MultipartFile', 'addMultipartFile']])('%p', (type, method) => {
  const myFile = { name: 'myFile', type };
  const rp = 'org.springframework.web.bind.annotation.RequestParam';

  test('basic', () => {
    const code = buildTsFoo({ ...myFile, annotations: [{ type: rp }] });
    expect(code).toContain(`.${method}('myFile', myFile)`);
  });

  test('rename', () => {
    const code = buildTsFoo({ ...myFile, annotations: [{ type: rp, attributes: { value: 'hehe' } }] });
    expect(code).toContain(`.${method}('hehe', myFile)`);
  });

  test('without annotation', () => {
    const code = buildTsFoo(myFile);
    expect(code).toContain(`.${method}('myFile', myFile)`);
  });
});

describe('Ignored type', () => {
  const testIgnoredTypes = test.each([
    ['javax.servlet.http.HttpServletRequest'],
    ['javax.servlet.http.HttpServletResponse'],
    ['jakarta.servlet.http.HttpServletRequest'],
    ['jakarta.servlet.http.HttpServletResponse'],
    ['org.springframework.http.HttpEntity<Object>'],
    ['org.springframework.http.HttpEntity<String>'],
    ['org.springframework.http.HttpEntity'],
  ]);

  testIgnoredTypes('Only %p', (type) => {
    const c = buildTsFoo({ name: 'body', type });
    expect(c).toContain(`async foo(settings?: Partial<Settings>)`);
  });

  testIgnoredTypes('Long and %p', (type) => {
    const c = buildTsFoo({ name: 'body', type }, { name: 'l', type: 'long' });
    expect(c).toContain(`async foo(l: Long, settings?: Partial<Settings>)`);
  });
});

describe.each([['org.springframework.web.bind.annotation.CookieValue']])('%p', (type) => {
  const arg1 = { name: 'arg1', type: 'java.lang.Long' };
  test('sginle', () => {
    const code = buildTsFoo({
      ...arg1,
      annotations: [{ type }],
    });
    expect(code).toContain(`async foo(settings?: Partial<Settings>)`);
  });

  test('with RequestParam together', () => {
    const code = buildTsFoo({
      ...arg1,
      annotations: [{ type }, { type: 'org.springframework.web.bind.annotation.RequestParam' }],
    });
    expect(code).toContain(`async foo(arg1: Long, settings?: Partial<Settings>)`);
    expect(code).toContain(`.addRequestParam('arg1', arg1)`);
  });
});
