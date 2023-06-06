import { NadClass, NadRoute } from '../../types/nad';
import { Builder } from '../../Builder';
import { mg } from '../test-tools/mg';
import { DeepPartial } from '../../utils';

const config = { base: 'test', target: 'oc' } as const;

test('Tree', () => {
  const getTree: DeepPartial<NadRoute> = {
    name: 'getTree',
    bean: 'test.Demo',
    returnType: 'test.Node',
  };

  const Node: DeepPartial<NadClass> = {
    name: 'test.Node',
    members: [
      { name: 'parent', type: 'test.Node' },
      { name: 'children', type: 'test.Node[]' },
    ],
  };

  const code = new Builder({
    ...config,
    defs: { routes: [getTree], classes: [Node] },
  }).code.replace(/\s+/g, ' ');

  expect(code).toContain(mg`
    @interface Node : NSObject
    @property (nonatomic, assign) Node *parent;
    @property (nonatomic, assign) NSArray<Node*> *children;
    @end
  `);
});
