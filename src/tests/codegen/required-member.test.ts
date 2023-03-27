import { NadAnnotation, NadClass, NadMember, NadRoute } from '../../types/nad';
import { Builder } from '../../Builder';

const buildCode = (...members: NadMember[]) => {
  const foo: NadRoute = {
    name: 'foo',
    bean: 'test.Demo',
    headers: [],
    parameters: [],
    annotations: [],
    returnType: 'test.FooModel',
    consumes: [],
    methods: [],
    patterns: [],
    produces: [],
  };
  const FooModel: NadClass = {
    name: 'test.FooModel',
    interfaces: [],
    members,
    typeParameters: [],
    annotations: [],
  };
  const { code } = new Builder({ target: 'ts', base: '', defs: { routes: [foo], classes: [FooModel] } });
  return code.replace(/\s+/g, ' ');
};

const buildCodeA = (...annotations: NadAnnotation[]) => {
  return buildCode({ name: 'a', type: 'java.lang.Long', annotations: [annotations] });
};

test('lombok.NonNull', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildCodeA({ type, attributes: {} });
  expect(code).toContain(`export interface FooModel { a: Long; }`);
});

test('org.springframework.lang.NonNull', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildCodeA({ type, attributes: {} });
  expect(code).toContain(`export interface FooModel { a: Long; }`);
});

test('javax.annotation.Nonnull', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildCodeA({ type, attributes: {} });
  expect(code).toContain(`export interface FooModel { a: Long; }`);
});

test('javax.validation.constraints.NotNull', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildCodeA({ type, attributes: {} });
  expect(code).toContain(`export interface FooModel { a: Long; }`);
});

test('long', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildCode({ name: 'a', type, annotations: [] });
  expect(code).toContain(`export interface FooModel { a: Long; }`);
});

test('Object type', () => {
  const code = buildCode({ name: 'a', type: 'java.lang.Long', annotations: [] });
  expect(code).toContain(`export interface FooModel { a?: Long; }`);
});
