import { NadAnnotation, NadClass, NadMember, NadRoute } from '../../types/nad';
import { Builder } from '../../Builder';
import { DeepPartial } from '../../utils';

const buildCode = (...members: DeepPartial<NadMember>[]) => {
  const foo: DeepPartial<NadRoute> = {
    name: 'foo',
    bean: 'test.Demo',
    returnType: 'test.FooModel',
  };
  const FooModel: DeepPartial<NadClass> = {
    name: 'test.FooModel',
    members,
  };
  const { code } = new Builder({ target: 'ts', base: '', defs: { routes: [foo], classes: [FooModel] } });
  return code.replace(/\s+/g, ' ');
};

const buildCodeA = (...annotations: DeepPartial<NadAnnotation>[]) => {
  return buildCode({ name: 'a', type: 'java.lang.Long', annotations: [annotations] });
};

test('lombok.NonNull', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildCodeA({ type });
  expect(code).toContain(`export interface FooModel { a: Long; }`);
});

test('org.springframework.lang.NonNull', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildCodeA({ type });
  expect(code).toContain(`export interface FooModel { a: Long; }`);
});

test('javax.annotation.Nonnull', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildCodeA({ type });
  expect(code).toContain(`export interface FooModel { a: Long; }`);
});

test('javax.validation.constraints.NotNull', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildCodeA({ type });
  expect(code).toContain(`export interface FooModel { a: Long; }`);
});

test('long', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildCode({ name: 'a', type });
  expect(code).toContain(`export interface FooModel { a: Long; }`);
});

test('java.lang.Long', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildCode({ name: 'a', type });
  expect(code).toContain(`export interface FooModel { a?: Long; }`);
});
