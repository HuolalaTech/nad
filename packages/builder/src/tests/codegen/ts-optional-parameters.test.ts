import { buildTsMethodWithParameters } from '../test-tools/buildMethodWithParameters';

test('default optional parameters', () => {
  const code = buildTsMethodWithParameters(
    { name: 'a1', type: 'java.lang.Long' },
    { name: 'a2', type: 'java.lang.Long' },
  );
  expect(code).toContain(`async foo(a1?: Long, a2?: Long, settings?: Partial<Settings>)`);
});

test('required parameters at first', () => {
  const code = buildTsMethodWithParameters({ name: 'a1', type: 'long' }, { name: 'a2', type: 'java.lang.Long' });
  expect(code).toContain(`async foo(a1: Long, a2?: Long, settings?: Partial<Settings>)`);
});

test('required parameters at second', () => {
  const code = buildTsMethodWithParameters({ name: 'a1', type: 'java.lang.Long' }, { name: 'a2', type: 'long' });
  expect(code).toContain(`async foo(a1: Long | undefined, a2: Long, settings?: Partial<Settings>)`);
});

test('A primitive long', () => {
  const code = buildTsMethodWithParameters({ name: 'a', type: 'long' });
  expect(code).toContain(`async foo(a: Long, settings?: Partial<Settings>)`);
});

test('A primitive long but the default value is provided', () => {
  const code = buildTsMethodWithParameters({
    name: 'a',
    type: 'long',
    annotations: [{ type: 'org.springframework.web.bind.annotation.RequestParam', attributes: { defaultValue: '0' } }],
  });
  expect(code).toContain(`async foo(a?: Long, settings?: Partial<Settings>)`);
});

test('A primitive long but the default value is provided but the value is default', () => {
  const code = buildTsMethodWithParameters({
    name: 'a',
    type: 'long',
    annotations: [
      {
        type: 'org.springframework.web.bind.annotation.RequestParam',
        attributes: { defaultValue: '\n\t\t\n\t\t\n\uE000\uE001\uE002\n\t\t\t\t\n' },
      },
    ],
  });
  expect(code).toContain(`async foo(a: Long, settings?: Partial<Settings>)`);
});
