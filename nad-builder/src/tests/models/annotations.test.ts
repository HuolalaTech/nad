import { NadAnnotation } from '../../types/nad';
import { Annotations, Class, Root } from '../../models';

const root = new Root({});

test('json', () => {
  const MyModel = new Class(
    {
      name: 'test.MyModel',
      members: [
        {
          name: 'a',
          type: '?',
          annotations: [[{ type: 'com.fasterxml.jackson.annotation.JsonIgnore', attributes: { value: true } }]],
        },
        {
          name: 'b',
          type: '?',
          annotations: [[{ type: 'com.alibaba.fastjson.annotation.JSONField', attributes: { serialize: false } }]],
        },
        {
          name: 'c',
          type: '?',
          annotations: [[{ type: 'com.fasterxml.jackson.annotation.JsonProperty', attributes: { value: 'jackson' } }]],
        },
        {
          name: 'd',
          type: '?',
          annotations: [[{ type: 'com.alibaba.fastjson.annotation.JSONField', attributes: { name: 'fastjson' } }]],
        },
      ],
    },
    root,
  );

  const { members } = MyModel;
  expect(members).toMatchObject([{ name: 'jackson' }, { name: 'fastjson' }]);
});

test('bad annotations', () => {
  expect(() => {
    new Annotations(null as unknown as NadAnnotation[]);
  }).not.toThrow();

  const ans = new Annotations([
    null,
    '',
    {},
    { type: 123, attributes: { a: 'bad' } },
    { type: '123', attributes: { a: 'good' } },
  ] as unknown as NadAnnotation[]);
  expect(ans.find('123')?.a).toBe('good');
});
