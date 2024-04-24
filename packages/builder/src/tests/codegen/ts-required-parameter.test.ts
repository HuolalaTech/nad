import { DeepPartial } from '../../utils';
import { NadAnnotation } from '../../types/nad';
import { buildTsMethodWithParameters } from '../test-tools/buildMethodWithParameters';

const buildA = (...annotations: DeepPartial<NadAnnotation>[]) => {
  return buildTsMethodWithParameters({ name: 'a', type: 'java.lang.Long', annotations });
};

test('lombok.NonNull', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildA({ type });
  expect(code).toContain(`async foo(a: Long, settings?: Partial<Settings>)`);
});

test('org.springframework.lang.NonNull', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildA({ type });
  expect(code).toContain(`async foo(a: Long, settings?: Partial<Settings>)`);
});

test('javax.annotation.Nonnull', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildA({ type });
  expect(code).toContain(`async foo(a: Long, settings?: Partial<Settings>)`);
});

test('javax.validation.constraints.NotNull', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildA({ type });
  expect(code).toContain(`async foo(a: Long, settings?: Partial<Settings>)`);
});

test('org.springframework.web.bind.annotation.RequestParam', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildA({ type, attributes: { required: true } });
  expect(code).toContain(`async foo(a: Long, settings?: Partial<Settings>)`);
});

test('org.springframework.web.bind.annotation.RequestBody', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildA({ type, attributes: { required: true } });
  expect(code).toContain(`async foo(a: Long, settings?: Partial<Settings>)`);
});

test('org.springframework.web.bind.annotation.PathVariable', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildA({ type, attributes: { required: true } });
  expect(code).toContain(`async foo(a: Long, settings?: Partial<Settings>)`);
});

test('long', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsMethodWithParameters({ name: 'a', type });
  expect(code).toContain(`async foo(a: Long, settings?: Partial<Settings>)`);
});

test('java.lang.Long', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsMethodWithParameters({ name: 'a', type });
  expect(code).toContain(`async foo(a?: Long, settings?: Partial<Settings>)`);
});
