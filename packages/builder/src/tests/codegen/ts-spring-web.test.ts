import { DeepPartial } from '../../utils';
import { NadAnnotation } from '../../types/nad';
import { buildTsFoo } from '../test-tools/buildFoo';

const buildA = (...annotations: DeepPartial<NadAnnotation>[]) => {
  return buildTsFoo({ name: 'id', type: 'java.lang.Long', annotations });
};

test('RequestParam auto', () => {
  const code = buildA();
  expect(code).toContain(`.addRequestParam('id', id)`);
});

test('RequestParam', () => {
  const code = buildA({ type: 'org.springframework.web.bind.annotation.RequestParam' });
  expect(code).toContain(`.addRequestParam('id', id)`);
});

test('RequestParam rename', () => {
  const code = buildA({ type: 'org.springframework.web.bind.annotation.RequestParam', attributes: { value: 'x' } });
  expect(code).toContain(`.addRequestParam('x', id)`);
});

test('PathVariable', () => {
  const code = buildA({ type: 'org.springframework.web.bind.annotation.PathVariable' });
  expect(code).toContain(`.addPathVariable('id', id)`);
});

test('PathVariable rename', () => {
  const code = buildA({ type: 'org.springframework.web.bind.annotation.PathVariable', attributes: { value: 'x' } });
  expect(code).toContain(`.addPathVariable('x', id)`);
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

test('ModelAttribute auto', () => {
  const code = buildTsFoo({ name: 'people', type: 'test.People' });
  expect(code).toContain(`.addModelAttribute(people)`);
});

test('MultipartFile without annotation', () => {
  const code = buildTsFoo({
    name: 'myFile',
    type: 'org.springframework.web.multipart.MultipartFile',
  });
  expect(code).toContain(`.addMultipartFile('myFile', myFile)`);
});

test('MultipartFile', () => {
  const code = buildTsFoo({
    name: 'myFile',
    type: 'org.springframework.web.multipart.MultipartFile',
    annotations: [{ type: 'org.springframework.web.bind.annotation.RequestParam' }],
  });
  expect(code).toContain(`.addMultipartFile('myFile', myFile)`);
});

test('MultipartFile rename', () => {
  const code = buildTsFoo({
    name: 'myFile',
    type: 'org.springframework.web.multipart.MultipartFile',
    annotations: [{ type: 'org.springframework.web.bind.annotation.RequestParam', attributes: { value: 'hehe' } }],
  });
  expect(code).toContain(`.addMultipartFile('hehe', myFile)`);
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
