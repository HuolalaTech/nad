import { buildTsMethodWithParameters } from '../test-tools/buildMethodWithParameters';

test.each([
  ['test.UserType', 'UserType'],
  ['test.User', 'PropertyKey'],
  ['java.lang.Long', 'Long'],
  ['java.lang.Integer', 'number'],
  ['java.lang.Double', 'number'],
  ['java.lang.String', 'string'],
  ['java.math.BigDecimal', 'BigDecimal'],
  ['java.math.BigInteger', 'BigInteger'],
])('java.util.Map<%s, java.lang.Long>', (keyType, tsType) => {
  const code = buildTsMethodWithParameters({ name: 'map', type: `java.util.Map<${keyType}, java.lang.Long>` });
  expect(code).toMatchCode(
    `async foo(map?: Record<${tsType}, Long | undefined>, settings?: Partial<Settings>) {`,
  );
});
