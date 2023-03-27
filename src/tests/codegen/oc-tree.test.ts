import { NadClass, NadRoute } from '../../types/nad';
import { Builder } from '../../Builder';
import { mg } from '../test-tools/mg';

const config = { base: 'test', target: 'oc' } as const;

test('Tree', () => {
  const getTree: Partial<NadRoute> = {
    name: 'getTree',
    bean: 'test.Demo',
    parameters: [],
    returnType: 'test.Node',
  };

  const Node: Partial<NadClass> = {
    name: 'test.Node',
    members: [
      { name: 'parent', type: 'test.Node', annotations: [] },
      { name: 'children', type: 'test.Node[]', annotations: [] },
    ],
  };

  const code = new Builder({
    ...config,
    defs: { routes: [getTree], classes: [Node] },
  }).code.replace(/\s+/g, ' ');

  // expect(code).toContain(`new NadInvoker<Node>`);
  expect(code).toContain(mg`
    @interface Node : NSObject
    @property (nonatomic, assign) Node *parent;
    @property (nonatomic, assign) NSArray<Node*> *children;
    @end
  `);
});
