import { DeepPartial } from '../../utils';
import { NadAnnotation } from '../../types/nad';
import { buildOcFoo } from '../test-tools/buildFoo';

const buildA = (...annotations: DeepPartial<NadAnnotation>[]) => {
  return buildOcFoo({ name: 'id', type: 'java.lang.Long', annotations });
};

describe.each([
  ['org.springframework.web.bind.annotation.PathVariable', 'addPathVariable'],
  ['org.springframework.web.bind.annotation.RequestParam', 'addRequestParam'],
  ['org.springframework.web.bind.annotation.RequestHeader', 'addHeader'],
])('%p', (type, method) => {
  test('basic', () => {
    const code = buildA({ type });
    expect(code).toContain('- (NSNumber*)foo:(NSNumber*)id;');
    expect(code).toContain(`[req ${method}:@"id" value:id]`);
  });

  test('rename with value', () => {
    const code = buildA({ type, attributes: { value: 'x' } });
    expect(code).toContain('- (NSNumber*)foo:(NSNumber*)id;');
    expect(code).toContain(`[req ${method}:@"x" value:id]`);
  });

  test('rename', () => {
    const code = buildA({ type, attributes: { name: 'x' } });
    expect(code).toContain('- (NSNumber*)foo:(NSNumber*)id;');
    expect(code).toContain(`[req ${method}:@"x" value:id]`);
  });

  test('optional', () => {
    const code = buildA({ type, attributes: { required: false } });
    expect(code).toContain('- (NSNumber*)foo:(NSNumber*)id;');
    expect(code).toContain(`[req ${method}:@"id" value:id]`);
  });
});

describe.each([['org.springframework.web.bind.annotation.RequestParam', 'addRequestParam']])('%p', (_, method) => {
  test('auto', () => {
    const code = buildA();
    expect(code).toContain('- (NSNumber*)foo:(NSNumber*)id;');
    expect(code).toContain(`[req ${method}:@"id" value:id]`);
  });
});

describe.each([['org.springframework.web.bind.annotation.ModelAttribute', 'addModelAttribute']])(
  '%p',
  (type, method) => {
    const user = { name: 'user', type: 'test.User' };
    test('default', () => {
      const code = buildOcFoo({ ...user, annotations: [{ type }] });
      expect(code).toContain('- (NSNumber*)foo:(User*)user;');
      expect(code).toContain(`[req ${method}:user]`);
    });

    test('auto', () => {
      const code = buildOcFoo(user);
      expect(code).toContain(`[req ${method}:user]`);
    });
  },
);

describe.each([['org.springframework.web.bind.annotation.RequestBody', 'addRequestBody']])('%p', (type, method) => {
  const user = { name: 'user', type: 'test.User' };
  test('default', () => {
    const code = buildOcFoo({ ...user, annotations: [{ type }] });
    expect(code).toContain('- (NSNumber*)foo:(User*)user;');
    expect(code).toContain(`[req ${method}:user]`);
  });

  test('optional', () => {
    const code = buildOcFoo({ ...user, annotations: [{ type, attributes: { required: false } }] });
    expect(code).toContain('- (NSNumber*)foo:(User*)user;');
    expect(code).toContain(`[req ${method}:user]`);
  });
});

describe.each([['org.springframework.web.multipart.MultipartFile', 'addMultipartFile']])('%p', (type, method) => {
  const myFile = { name: 'myFile', type };
  const rp = 'org.springframework.web.bind.annotation.RequestParam';

  test('basic', () => {
    const code = buildOcFoo({ ...myFile, annotations: [{ type: rp }] });
    expect(code).toContain(`[req ${method}:@"myFile" value:myFile]`);
  });

  test('rename', () => {
    const code = buildOcFoo({ ...myFile, annotations: [{ type: rp, attributes: { value: 'hehe' } }] });
    expect(code).toContain(`[req ${method}:@"hehe" value:myFile]`);
  });

  test('without annotation', () => {
    const code = buildOcFoo(myFile);
    expect(code).toContain(`[req ${method}:@"myFile" value:myFile]`);
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
    const code = buildOcFoo({ name: 'body', type });
    expect(code).toContain('- (NSNumber*)foo;');
  });

  testIgnoredTypes('Long and %p', (type) => {
    const code = buildOcFoo({ name: 'body', type }, { name: 'id', type: 'long' });
    expect(code).toContain('- (NSNumber*)foo:(NSNumber*)id;');
  });
});

describe.each([['org.springframework.web.bind.annotation.CookieValue']])('%p', (type) => {
  const arg1 = { name: 'arg1', type: 'java.lang.Long' };
  test('sginle', () => {
    const code = buildOcFoo({
      ...arg1,
      annotations: [{ type }],
    });
    expect(code).toContain('- (NSNumber*)foo;');
  });

  test('with RequestParam together', () => {
    const code = buildOcFoo({
      ...arg1,
      annotations: [{ type }, { type: 'org.springframework.web.bind.annotation.RequestParam' }],
    });
    expect(code).toContain('- (NSNumber*)foo:(NSNumber*)arg1;');
    expect(code).toContain(`[req addRequestParam:@"arg1" value:arg1]`);
  });
});
