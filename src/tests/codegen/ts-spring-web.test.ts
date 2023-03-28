import { NadAnnotation } from '../../types/nad';
import { buildTsFoo } from '../test-tools/buildFoo';

const buildA = (...annotations: NadAnnotation[]) => {
  return buildTsFoo({ name: 'id', type: 'java.lang.Long', annotations });
};

test('RequestParam auto', () => {
  const code = buildA();
  expect(code).toContain(`.addRequestParam('id', id)`);
});

test('RequestParam', () => {
  const code = buildA({ type: 'org.springframework.web.bind.annotation.RequestParam', attributes: {} });
  expect(code).toContain(`.addRequestParam('id', id)`);
});

test('RequestParam rename', () => {
  const code = buildA({ type: 'org.springframework.web.bind.annotation.RequestParam', attributes: { value: 'x' } });
  expect(code).toContain(`.addRequestParam('x', id)`);
});

test('PathVariable', () => {
  const code = buildA({ type: 'org.springframework.web.bind.annotation.PathVariable', attributes: {} });
  expect(code).toContain(`.addPathVariable('id', id)`);
});

test('PathVariable rename', () => {
  const code = buildA({ type: 'org.springframework.web.bind.annotation.PathVariable', attributes: { value: 'x' } });
  expect(code).toContain(`.addPathVariable('x', id)`);
});

test('RequestBody', () => {
  const code = buildTsFoo({
    name: 'user',
    type: 'test.User',
    annotations: [{ type: 'org.springframework.web.bind.annotation.RequestBody', attributes: {} }],
  });
  expect(code).toContain(`.addRequestBody(user)`);
});

test('ModelAttribute', () => {
  const code = buildTsFoo({
    name: 'user',
    type: 'test.User',
    annotations: [{ type: 'org.springframework.web.bind.annotation.ModelAttribute', attributes: {} }],
  });
  expect(code).toContain(`.addModelAttribute(user)`);
});

test('ModelAttribute auto', () => {
  const code = buildTsFoo({ name: 'people', type: 'test.People', annotations: [] });
  expect(code).toContain(`.addModelAttribute(people)`);
});

test('MultipartFile without annotation', () => {
  const code = buildTsFoo({
    name: 'myFile',
    type: 'org.springframework.web.multipart.MultipartFile',
    annotations: [],
  });
  expect(code).toContain(`.addMultipartFile('myFile', myFile)`);
});

test('MultipartFile', () => {
  const code = buildTsFoo({
    name: 'myFile',
    type: 'org.springframework.web.multipart.MultipartFile',
    annotations: [{ type: 'org.springframework.web.bind.annotation.RequestParam', attributes: {} }],
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

test('org.springframework.http.HttpEntity<String>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsFoo({ name: 'body', type, annotations: [] });
  expect(code).toContain(`async foo(settings?: Partial<Settings>)`);
});

test('org.springframework.http.HttpEntity<Object>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsFoo({ name: 'body', type, annotations: [] });
  expect(code).toContain(`async foo(settings?: Partial<Settings>)`);
});

test('javax.servlet.http.HttpServletRequest', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsFoo({ name: 'body', type, annotations: [] });
  expect(code).toContain(`async foo(settings?: Partial<Settings>)`);
});

test('javax.servlet.http.HttpServletResponse', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsFoo({ name: 'body', type, annotations: [] });
  expect(code).toContain(`async foo(settings?: Partial<Settings>)`);
});
