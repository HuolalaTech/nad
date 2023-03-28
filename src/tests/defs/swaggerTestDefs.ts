import { DeepPartial } from '../../utils';
import { NadClass, NadEnum, NadModule, NadResult, NadRoute } from '../../types/nad';

const Demo: Partial<NadModule> = {
  name: 'test.Demo',
  annotations: [{ type: 'io.swagger.annotations.Api', attributes: { value: 'My Module' } }],
};

const foo: Partial<NadRoute> = {
  name: 'foo',
  bean: 'test.Demo',
  methods: ['POST'],
  patterns: ['/foo'],
  headers: [],
  annotations: [{ type: 'io.swagger.annotations.ApiOperation', attributes: { value: 'My Route' } }],
  parameters: [
    {
      name: 'id',
      type: 'java.lang.Long',
      annotations: [{ type: 'io.swagger.annotations.ApiParam', attributes: { name: 'My ID' } }],
    },
  ],
  returnType: 'test.FooModel',
};

const FooModel: Partial<NadClass> = {
  name: 'test.FooModel',
  annotations: [{ type: 'io.swagger.annotations.ApiModel', attributes: { value: 'My Model' } }],
  members: [
    {
      annotations: [[{ type: 'io.swagger.annotations.ApiModelProperty', attributes: { name: 'My Field' } }]],
      name: 'type',
      type: 'test.FooEnum',
    },
  ],
};

const FooEnum: Partial<NadEnum> = {
  name: 'test.FooEnum',
  annotations: [{ type: 'io.swagger.annotations.ApiModel', attributes: { value: 'My Enum' } }],
  constants: [
    {
      name: 'Type1',
      value: 'TYPE1',
      properties: { desc: 'My Type1' },
      annotations: [{ type: 'io.swagger.annotations.ApiModelProperty', attributes: { value: 'My Type One' } }],
    },
    {
      name: 'Type2',
      value: 'TYPE2',
      properties: { desc: 'My Type2' },
      annotations: [{ type: 'io.swagger.annotations.ApiModelProperty', attributes: { value: 'My Type Two' } }],
    },
  ],
};

export const swaggerTestDefs: DeepPartial<NadResult> = {
  routes: [foo],
  classes: [FooModel],
  enums: [FooEnum],
  modules: [Demo],
};
