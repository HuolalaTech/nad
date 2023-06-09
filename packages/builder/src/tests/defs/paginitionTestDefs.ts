import { DeepPartial } from '../../utils';
import { NadClass, NadResult, NadRoute } from '../../types/nad';

const routes: Partial<NadRoute>[] = [
  {
    bean: 'test.FooModule',
    name: 'foo',
    returnType: 'test.MetaPaginition<java.lang.Long[]>',
  },
];

const classes: DeepPartial<NadClass>[] = [
  {
    name: 'test.Paginition',
    typeParameters: ['T'],
    members: [
      { name: 'data', type: 'T' },
      { name: 'limit', type: 'java.lang.Long' },
      { name: 'offset', type: 'java.lang.Long' },
    ],
  },
  {
    name: 'test.MetaPaginition',
    superclass: 'test.Paginition<T>',
    typeParameters: ['T'],
    members: [{ name: 'meta', type: 'java.lang.Object' }],
  },
];

export const paginitionDefs: DeepPartial<NadResult> = { routes, classes };
