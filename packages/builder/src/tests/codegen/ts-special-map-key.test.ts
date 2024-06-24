import { buildTsMethodWithParameters } from '../test-tools/buildMethodWithParameters';

test('java.util.Map<test.UserType, java.lang.Long>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsMethodWithParameters({ name: 'map', type });
  expect(code).toContain(`map?: Record<UserType, Long>`);
});

test('java.util.Map<test.User, java.lang.Long>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsMethodWithParameters({ name: 'map', type });
  expect(code).toContain(`map?: Record<PropertyKey, Long>`);
});

test('java.util.Map<java.lang.Long, java.lang.Long>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsMethodWithParameters({ name: 'map', type });
  expect(code).toContain(`map?: Record<Long, Long>`);
});

test('java.util.Map<java.lang.Integer, java.lang.Long>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsMethodWithParameters({ name: 'map', type });
  expect(code).toContain(`map?: Record<number, Long>`);
});

test('java.util.Map<java.lang.Double, java.lang.Long>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsMethodWithParameters({ name: 'map', type });
  expect(code).toContain(`map?: Record<number, Long>`);
});

test('java.util.Map<java.lang.String, java.lang.Long>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsMethodWithParameters({ name: 'map', type });
  expect(code).toContain(`map?: Record<string, Long>`);
});

test('java.util.Map<java.math.BigDecimal, java.lang.Long>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsMethodWithParameters({ name: 'map', type });
  expect(code).toContain(`map?: Record<BigDecimal, Long>`);
});

test('java.util.Map<java.math.BigInteger, java.lang.Long>', () => {
  const { currentTestName: type = '' } = expect.getState();
  const code = buildTsMethodWithParameters({ name: 'map', type });
  expect(code).toContain(`map?: Record<BigInteger, Long>`);
});
