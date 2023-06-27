import { Builder } from '../../Builder';
import { mg } from '../test-tools/mg';

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
}).code.replace(/\s+/g, ' ');

test('f1', () => {
  expect(code).toContain(mg`.addCustomFlags('soa')`);
});

test('f2', () => {
  expect(code).toContain(mg`.addCustomFlags('soa', 'hehe')`);
});
