import { DeepPartial } from '../../utils';
import { NadAnnotation } from '../../types/nad';
import { buildTsFoo, buildOcFoo } from '../test-tools/buildFoo';

const assertMethodForTs = (code: string, method: string, ...args: [string, string] | [string]) => {
  if (args.length === 1) {
    expect(code).toContain(`.${method}(${args[0]})`);
  } else {
    expect(code).toContain(`.${method}('${args[0]}', ${args[1]})`);
  }
};

const assertMethodForOc = (code: string, method: string, ...args: [string, string] | [string]) => {
  if (args.length === 1) {
    expect(code).toContain(`[req ${method}:${args[0]}]`);
  } else {
    expect(code).toContain(`[req ${method}:@"${args[0]}" value:${args[1]}]`);
  }
};

const assertParameterForTs = (code: string, ...args: [string, string, '?' | ''] | []) => {
  if (args.length === 0) {
    expect(code).toContain(`async foo(settings?: Partial<Settings>)`);
  } else {
    const [name, type, optional] = args;
    expect(code).toContain(`async foo(${name}${optional}: ${type}, settings?: Partial<Settings>)`);
  }
};

const assertParameterForOc = (code: string, ...args: [string, string, '?' | ''] | []) => {
  if (args.length === 0) {
    expect(code).toContain(`- (NSNumber*)foo;`);
  } else {
    const [name, type] = args;
    expect(code).toContain(`- (NSNumber*)foo:(${type}*)${name};`);
  }
};

describe.each([
  ['ts', buildTsFoo, assertMethodForTs, assertParameterForTs],
  ['oc', buildOcFoo, assertMethodForOc, assertParameterForOc],
])('%p', (target, buildFoo, assertMethod, assertParameter) => {
  const buildA = (...annotations: DeepPartial<NadAnnotation>[]) => {
    return buildFoo({ name: 'user', type: 'test.User', annotations });
  };

  describe.each([
    ['org.springframework.web.bind.annotation.PathVariable', 'addPathVariable'],
    ['org.springframework.web.bind.annotation.RequestParam', 'addRequestParam'],
    ['org.springframework.web.bind.annotation.RequestHeader', 'addHeader'],
  ])('%p', (type, method) => {
    test('basic', () => {
      const code = buildA({ type });
      assertParameter(code, 'user', 'User', '');
      assertMethod(code, method, 'user', 'user');
    });

    test('rename with value', () => {
      const code = buildA({ type, attributes: { value: 'x' } });
      assertParameter(code, 'user', 'User', '');
      assertMethod(code, method, 'x', 'user');
    });

    test('rename', () => {
      const code = buildA({ type, attributes: { name: 'x' } });
      assertParameter(code, 'user', 'User', '');
      assertMethod(code, method, 'x', 'user');
    });

    test('optional', () => {
      const code = buildA({ type, attributes: { required: false } });
      assertParameter(code, 'user', 'User', '?');
      assertMethod(code, method, 'user', 'user');
    });
  });

  describe.each([['org.springframework.web.bind.annotation.RequestParam', 'addRequestParam']])('%p', (_, method) => {
    test('auto', () => {
      const code = buildFoo({ name: 'id', type: 'long' });
      const type = target === 'ts' ? 'Long' : 'NSNumber';
      assertParameter(code, 'id', type, '');
      assertMethod(code, method, 'id', 'id');
    });
  });

  describe.each([['org.springframework.web.bind.annotation.ModelAttribute', 'addModelAttribute']])(
    '%p',
    (type, method) => {
      const user = { name: 'user', type: 'test.User' };
      test('default', () => {
        const code = buildFoo({ ...user, annotations: [{ type }] });
        assertParameter(code, 'user', 'User', '?');
        assertMethod(code, method, 'user');
      });

      test('auto', () => {
        const code = buildFoo(user);
        assertMethod(code, method, 'user');
      });
    },
  );

  describe.each([['org.springframework.web.bind.annotation.RequestBody', 'addRequestBody']])('%p', (type, method) => {
    const user = { name: 'user', type: 'test.User' };
    test('default', () => {
      const code = buildFoo({ ...user, annotations: [{ type }] });
      assertParameter(code, 'user', 'User', '');
      assertMethod(code, method, 'user');
    });

    test('optional', () => {
      const code = buildFoo({ ...user, annotations: [{ type, attributes: { required: false } }] });
      assertParameter(code, 'user', 'User', '?');
      assertMethod(code, method, 'user');
    });
  });

  describe.each([['org.springframework.web.multipart.MultipartFile', 'addMultipartFile']])('%p', (type, method) => {
    const myFile = { name: 'myFile', type };
    const rp = 'org.springframework.web.bind.annotation.RequestParam';

    test('basic', () => {
      const code = buildFoo({ ...myFile, annotations: [{ type: rp }] });
      assertMethod(code, method, 'myFile', 'myFile');
    });

    test('rename', () => {
      const code = buildFoo({ ...myFile, annotations: [{ type: rp, attributes: { value: 'hehe' } }] });
      assertMethod(code, method, 'hehe', 'myFile');
    });

    test('without annotation', () => {
      const code = buildFoo(myFile);
      assertMethod(code, method, 'myFile', 'myFile');
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
      const code = buildFoo({ name: 'body', type });
      assertParameter(code);
    });

    testIgnoredTypes('User and %p', (type) => {
      const code = buildFoo({ name: 'body', type }, { name: 'user', type: 'test.User' });
      assertParameter(code, 'user', 'User', '?');
    });
  });

  describe.each([['org.springframework.web.bind.annotation.CookieValue']])('%p', (type) => {
    const arg1 = { name: 'arg1', type: 'test.User' };
    test('sginle', () => {
      const code = buildFoo({
        ...arg1,
        annotations: [{ type }],
      });
      assertParameter(code);
    });

    test('with RequestParam together', () => {
      const code = buildFoo({
        ...arg1,
        annotations: [{ type }, { type: 'org.springframework.web.bind.annotation.RequestParam' }],
      });
      assertParameter(code, 'arg1', 'User', '');
      assertMethod(code, 'addRequestParam', 'arg1', 'arg1');
    });
  });
});
