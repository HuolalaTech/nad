import { NadAnnotation } from '../../types/nad';
import { Annotations, Class, RawClass, Root } from '../../models';
import { RequestMappingConditionExpression } from '../../models/annotations/RequestMapping';

const root = new Root({});

test('json', () => {
  const MyModel = new RawClass(
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
  ).use();

  const { members } = MyModel;
  expect(members).toMatchObject([{ name: 'jackson' }, { name: 'fastjson' }]);
});

test('bad annotations', () => {
  expect(Annotations.create(null as unknown as NadAnnotation[])).toBeUndefined();

  const ans = Annotations.create([
    null,
    '',
    {},
    { type: 123, attributes: { a: 'bad' } },
    { type: '123', attributes: { a: 'good' } },
  ] as unknown as NadAnnotation[]);
  expect(ans.find('123')?.a).toBe('good');
});

test('RequestMappingConditionExpression', () => {
  const { create } = RequestMappingConditionExpression;
  expect(create('a=1')).toMatchObject({ key: 'a', value: '1', negative: false });
  expect(create('a!=1')).toMatchObject({ key: 'a', value: '1', negative: true });
  expect(create('a!=1=1')).toMatchObject({ key: 'a', value: '1=1', negative: true });
  expect(create('a=1!=1')).toMatchObject({ key: 'a', value: '1!=1', negative: false });
  expect(create('a')).toBeNull();
  expect(create(1)).toBeNull();
  expect(create(null)).toBeNull();
});
