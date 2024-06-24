import { Builder } from '../../Builder';

const code = new Builder({
  target: 'ts',
  base: '',
  defs: {
    modules: [{ name: 'test.Demo' }],
    routes: [
      {
        name: 'f1',
        bean: 'test.Demo',
        methods: ['POST'],
        patterns: ['/foo'],
        customFlags: ['soa'],
      },
      {
        name: 'f2',
        bean: 'test.Demo',
        methods: ['POST'],
        patterns: ['/foo'],
        customFlags: ['soa', 'hehe'],
      },
    ],
  },
}).code;

test('f1', () => {
  expect(code).toMatchCode(`.addCustomFlags('soa')`);
});

test('f2', () => {
  expect(code).toMatchCode(`.addCustomFlags('soa', 'hehe')`);
});
