import { Root } from '../../models';
import { Builder } from '../../Builder';
import { DeepPartial } from '../../utils';
import { NadClass, NadRoute } from '../../types/nad';

const classes: DeepPartial<NadClass>[] = [
  {
    name: 'test.People',
    members: [
      {
        name: 'name',
        type: 'java.lang.String',
      },
      {
        name: 'age',
        type: 'int',
      },
    ],
    superclass: 'java.lang.Object',
  },
];

const foo: DeepPartial<NadRoute> = {
  name: 'foo',
  bean: 'test.Demo',
  methods: ['POST'],
  patterns: ['/foo'],
  parameters: [
    {
      name: 'id',
      type: 'java.lang.Long',
    },
  ],
  returnType: 'java.lang.Long',
};

const defs = { routes: [foo], classes };

test('target = raw', () => {
  const defs = { routes: [foo], classes };
  const { code, root } = new Builder({ target: 'raw', base: '', defs });
  expect(code).toContain(JSON.stringify(defs, null, 2));
  expect(root).toBeInstanceOf(Root);
});

test('invalid target', () => {
  const builder = new Builder({ target: 'wtf' as 'raw', base: '', defs });
  expect(() => {
    builder.root;
  }).toThrow();
  expect(() => {
    builder.code;
  }).toThrow();
});
