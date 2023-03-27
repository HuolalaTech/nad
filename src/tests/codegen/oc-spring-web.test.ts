import { NadAnnotation } from '../../types/nad';
import { buildOcFoo } from '../test-tools/buildFoo';

const buildA = (...annotations: NadAnnotation[]) => {
  return buildOcFoo({ name: 'id', type: 'java.lang.Long', annotations });
};

test('RequestParam auto', () => {
  const code = buildA();
  expect(code).toContain(`[req addRequestParam:@"id" value:id]`);
});

test('RequestParam', () => {
  const code = buildA({ type: 'org.springframework.web.bind.annotation.RequestParam', attributes: {} });
  expect(code).toContain(`[req addRequestParam:@"id" value:id]`);
});

test('RequestParam rename', () => {
  const code = buildA({ type: 'org.springframework.web.bind.annotation.RequestParam', attributes: { value: 'x' } });
  expect(code).toContain(`[req addRequestParam:@"x" value:id]`);
});

test('PathVariable', () => {
  const code = buildA({ type: 'org.springframework.web.bind.annotation.PathVariable', attributes: {} });
  expect(code).toContain(`[req addPathVariable:@"id" value:id]`);
});

test('PathVariable rename', () => {
  const code = buildA({ type: 'org.springframework.web.bind.annotation.PathVariable', attributes: { value: 'x' } });
  expect(code).toContain(`[req addPathVariable:@"x" value:id]`);
});

test('RequestBody', () => {
  const code = buildOcFoo({
    name: 'user',
    type: 'test.User',
    annotations: [{ type: 'org.springframework.web.bind.annotation.RequestBody', attributes: {} }],
  });
  expect(code).toContain(`[req addRequestBody:user]`);
});

test('ModelAttribute', () => {
  const code = buildOcFoo({
    name: 'user',
    type: 'test.User',
    annotations: [{ type: 'org.springframework.web.bind.annotation.ModelAttribute', attributes: {} }],
  });
  expect(code).toContain(`[req addModelAttribute:user]`);
});

test('ModelAttribute auto', () => {
  const code = buildOcFoo({ name: 'people', type: 'test.People', annotations: [] });
  expect(code).toContain(`[req addModelAttribute:people]`);
});

test('MultipartFile', () => {
  const code = buildOcFoo({
    name: 'myFile',
    type: 'org.springframework.web.multipart.MultipartFile',
    annotations: [],
  });
  expect(code).toContain(`[req addMultipartFile:@"myFile" value:myFile]`);
});

test('MultipartFile rename', () => {
  const code = buildOcFoo({
    name: 'myFile',
    type: 'org.springframework.web.multipart.MultipartFile',
    annotations: [{ type: 'org.springframework.web.bind.annotation.RequestParam', attributes: { value: 'hehe' } }],
  });
  expect(code).toContain(`[req addMultipartFile:@"hehe" value:myFile]`);
});

test('org.springframework.http.HttpEntity<String>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildOcFoo({ name: 'body', type, annotations: [] });
  expect(code).toContain(`- (NSNumber*)foo {`);
});

test('org.springframework.http.HttpEntity<Object>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildOcFoo({ name: 'body', type, annotations: [] });
  expect(code).toContain(`- (NSNumber*)foo {`);
});

test('javax.servlet.http.HttpServletRequest', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildOcFoo({ name: 'body', type, annotations: [] });
  expect(code).toContain(`- (NSNumber*)foo {`);
});

test('javax.servlet.http.HttpServletResponse', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildOcFoo({ name: 'body', type, annotations: [] });
  expect(code).toContain(`- (NSNumber*)foo {`);
});
