import { isJavaUnknown } from 'src/helpers/javaHelper';
import { Class, Member, Root, Type } from '../../models';

const root = new Root({});

test('generic', () => {
  const clz = new Class(
    {
      name: 'test.MyClass',
      typeParameters: ['K', 'V'],
      members: [
        { name: 'key', type: 'K' },
        { name: 'value', type: 'java.util.List<V>' },
      ],
    },
    root,
  );

  expect(clz.members[0]).toBeInstanceOf(Member);
  expect(clz.members[0].name).toBe('key');
  expect(clz.members[0].type).toBeInstanceOf(Type);
  expect(clz.members[0].type.name).toBe('K');
  expect(clz.members[0].type.isGenericVariable).toBe(true);
  expect(clz.members[0]).toMatchObject({
    name: 'key',
    type: {
      name: 'K',
      parameters: [],
      isGenericVariable: true,
    },
  });

  expect(clz.members[1]).toBeInstanceOf(Member);
  expect(clz.members[1].type).toBeInstanceOf(Type);
  expect(clz.members[1]).toMatchObject({
    name: 'value',
    type: {
      name: 'java.util.List',
      parameters: [{ name: 'V', parameters: [], isGenericVariable: true }],
      isGenericVariable: false,
    },
  });

  expect(clz.name).toBe('test.MyClass');
  expect(clz.simpleName).toBe('MyClass');
  expect(clz.defName).toBe('MyClass<K, V>');
});

test('bad class name', () => {
  const clz = new Class({ name: '$$..' }, root);
  expect(clz.defName).toBe('UnknownClass');
});

test('bad member name', () => {
  const clz = new Class(
    {
      members: [{ name: '' }, { name: undefined }],
    },
    root,
  );

  expect(clz.members).toHaveLength(0);
});

test('hidden members', () => {
  const clz = new Class(
    {
      members: [
        { name: '' },
        { name: '~!@#' },
        {
          name: 'swagger',
          annotations: [[{ type: 'io.swagger.annotations.ApiModelProperty', attributes: { hidden: true } }]],
        },
        {
          name: 'JsonIgnore',
          annotations: [[{ type: 'com.fasterxml.jackson.annotation.JsonIgnore', attributes: { value: true } }]],
        },
        {
          name: 'JsonProperty',
          annotations: [[{ type: 'com.fasterxml.jackson.annotation.JsonProperty', attributes: { value: '~!@#' } }]],
        },
        {
          name: 'fastjson',
          annotations: [[{ type: 'com.alibaba.fastjson.annotation.JSONField', attributes: { serialize: false } }]],
        },
        {
          name: 'fastjson',
          annotations: [[{ type: 'com.alibaba.fastjson.annotation.JSONField', attributes: { name: '~!@#' } }]],
        },
      ],
    },
    root,
  );

  expect(clz.members).toHaveLength(0);
});

test('JsonNaming SnakeCaseStrategy', () => {
  const clz = new Class(
    {
      annotations: [
        {
          type: 'com.fasterxml.jackson.databind.annotation.JsonNaming',
          attributes: { value: 'com.fasterxml.jackson.databind.PropertyNamingStrategy$SnakeCaseStrategy' },
        },
      ],
      members: [
        { name: 'getUserInfo' },
        { name: 'getUserInfo2' },
        { name: 'legacy_get_user_info' },
        { name: 'mockXMLHttpRequest' },
      ],
    },
    root,
  );

  expect(clz.members[0].name).toBe('get_user_info');
  expect(clz.members[1].name).toBe('get_user_info_2');
  expect(clz.members[2].name).toBe('legacy_get_user_info');
  expect(clz.members[3].name).toBe('mock_x_m_l_http_request');
});
