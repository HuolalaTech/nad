import { buildTsMethodWithParameters } from '../test-tools/buildMethodWithParameters';

test('default optional parameters', () => {
  const code = buildTsMethodWithParameters({ name: 'a1', type: 'java.lang.Long' }, { name: 'a2', type: 'java.lang.Long' });
  expect(code).toContain(`async foo(a1?: Long, a2?: Long, settings?: Partial<Settings>)`);
});

test('required parameters at first', () => {
  const code = buildTsMethodWithParameters({ name: 'a1', type: 'long' }, { name: 'a2', type: 'java.lang.Long' });
  expect(code).toContain(`async foo(a1: Long, a2?: Long, settings?: Partial<Settings>)`);
});

test('required parameters at second', () => {
  const code = buildTsMethodWithParameters({ name: 'a1', type: 'java.lang.Long' }, { name: 'a2', type: 'long' });
  expect(code).toContain(`async foo(a1: Long | null, a2: Long, settings?: Partial<Settings>)`);
});
