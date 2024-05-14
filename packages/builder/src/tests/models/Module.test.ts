import { Dubious } from 'src/utils';
import { Builder } from '../../Builder';
import { Module } from '../../models';
import { HTTP_SERVLET_RESPONSE_SET } from '../../constants';

const builder = new Builder({ target: 'raw', base: '', defs: {} });
const { root } = builder;

test('Bad parameter', () => {
  const m = new Module({}, root, [
    {
      name: 'methodName',
      parameters: [
        {
          name: 'theFirstParameter',
          annotations: [
            { type: 'pAnnotation', attributes: { value: 456 } },
            // Bad Annotation
            undefined as unknown as Dubious<object>,
          ],
        },
        // Bad Parameter
        undefined as unknown as Dubious<object>,
      ],
      annotations: [
        { type: 'mAnnotation', attributes: { value: 123 } },
        // Bad Annotation
        undefined as unknown as Dubious<object>,
      ],
    },
  ]);
  expect(m.routes).toHaveLength(1);
  expect(m.routes[0].name).toBe('methodName');
  expect(m.routes[0].annotations.find('mAnnotation')?.value).toBe(123);
  expect(m.routes[0].parameters).toHaveLength(1);
  expect(m.routes[0].parameters[0].name).toBe('theFirstParameter');
  expect(m.routes[0].parameters[0].annotations.find('pAnnotation')?.value).toBe(456);
});


test('A void method that contains a servlet response parameter may return a free type', () => {
  const m = new Module({}, root, [
    {
      name: 'methodName',
      returnType: 'void',
      parameters: [
        { name: 'a', type: HTTP_SERVLET_RESPONSE_SET.values().next().value },
      ],
    },
  ]);
  expect(m.routes).toHaveLength(1);
  expect(m.routes[0].name).toBe('methodName');
  expect(m.routes[0].parameters).toHaveLength(0);
  expect(m.routes[0].returnType.name).toBe('java.lang.Object')
});