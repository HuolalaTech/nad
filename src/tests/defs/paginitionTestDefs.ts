import { DeepPartial } from 'src/utils';
import { NadClass, NadResult, NadRoute } from '../../types/nad';

const routes: Partial<NadRoute>[] = [
  {
    bean: 'test.FooModule',
    name: 'foo',
    returnType: 'test.MetaPaginition<java.lang.Long[]>',
  },
];

const classes: Partial<NadClass>[] = [
  {
    name: 'test.Paginition',
    typeParameters: ['T'],
    members: [
      { name: 'data', type: 'T', annotations: [] },
      { name: 'limit', type: 'java.lang.Long', annotations: [] },
      { name: 'offset', type: 'java.lang.Long', annotations: [] },
    ],
  },
  {
    name: 'test.MetaPaginition',
    superclass: 'test.Paginition<T>',
    typeParameters: ['T'],
    members: [{ name: 'meta', type: 'java.lang.Object', annotations: [] }],
  },
];

export const paginitionDefs: DeepPartial<NadResult> = { routes, classes };
