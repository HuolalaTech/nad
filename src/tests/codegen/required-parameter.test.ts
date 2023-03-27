import { NadAnnotation, NadRoute } from '../../types/nad';
import { Builder } from '../../Builder';

const buildCode = (...annotations: NadAnnotation[]) => {
  const foo: NadRoute = {
    name: 'foo',
    bean: 'test.Demo',
    headers: [],
    parameters: [{ name: 'a', type: 'java.lang.Long', annotations }],
    annotations: [],
    returnType: 'java.lang.Long',
    consumes: [],
    methods: [],
    patterns: [],
    produces: [],
  };
  const { code } = new Builder({ target: 'ts', base: '', defs: { routes: [foo], classes: [] } });
  return code;
};

test('lombok.NonNull', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildCode({ type, attributes: {} });
  expect(code).toContain(`async foo(a: Long, settings?: Partial<Settings>)`);
});

test('org.springframework.lang.NonNull', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildCode({ type, attributes: {} });
  expect(code).toContain(`async foo(a: Long, settings?: Partial<Settings>)`);
});

test('javax.annotation.Nonnull', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildCode({ type, attributes: {} });
  expect(code).toContain(`async foo(a: Long, settings?: Partial<Settings>)`);
});

test('javax.validation.constraints.NotNull', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildCode({ type, attributes: {} });
  expect(code).toContain(`async foo(a: Long, settings?: Partial<Settings>)`);
});

test('org.springframework.web.bind.annotation.RequestParam', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildCode({ type, attributes: { required: true } });
  expect(code).toContain(`async foo(a: Long, settings?: Partial<Settings>)`);
});

test('org.springframework.web.bind.annotation.RequestBody', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildCode({ type, attributes: { required: true } });
  expect(code).toContain(`async foo(a: Long, settings?: Partial<Settings>)`);
});

test('org.springframework.web.bind.annotation.PathVariable', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildCode({ type, attributes: { required: true } });
  expect(code).toContain(`async foo(a: Long, settings?: Partial<Settings>)`);
});

test('Optional', () => {
  const code = buildCode();
  expect(code).toContain(`async foo(a?: Long, settings?: Partial<Settings>)`);
});
