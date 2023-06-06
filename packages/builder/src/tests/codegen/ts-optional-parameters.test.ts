import { buildTsFoo } from '../test-tools/buildFoo';

test('default optional parameters', () => {
  const code = buildTsFoo({ name: 'a1', type: 'java.lang.Long' }, { name: 'a2', type: 'java.lang.Long' });
  expect(code).toContain(`async foo(a1?: Long, a2?: Long, settings?: Partial<Settings>)`);
});

test('required parameters at first', () => {
  const code = buildTsFoo({ name: 'a1', type: 'long' }, { name: 'a2', type: 'java.lang.Long' });
  expect(code).toContain(`async foo(a1: Long, a2?: Long, settings?: Partial<Settings>)`);
});

test('required parameters at second', () => {
  const code = buildTsFoo({ name: 'a1', type: 'java.lang.Long' }, { name: 'a2', type: 'long' });
  expect(code).toContain(`async foo(a1: Long | null, a2: Long, settings?: Partial<Settings>)`);
});
