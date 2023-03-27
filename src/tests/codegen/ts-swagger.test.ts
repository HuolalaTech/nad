import { Builder } from '../../Builder';
import { NadClass, NadEnum, NadRoute } from '../../types/nad';
import { mg } from '../test-tools/mg';

test('Swagger', () => {
  const foo: Partial<NadRoute> = {
    name: 'foo',
    bean: 'test.Demo',
    methods: ['POST'],
    patterns: ['/foo'],
    headers: [],
    annotations: [{ type: 'io.swagger.annotations.ApiOperation', attributes: { value: 'My API' } }],
    parameters: [
      {
        name: 'id',
        type: 'java.lang.Long',
        annotations: [{ type: 'io.swagger.annotations.ApiParam', attributes: { description: 'My ID' } }],
      },
    ],
    returnType: 'test.FooModel',
  };

  const FooModel: Partial<NadClass> = {
    name: 'test.FooModel',
    annotations: [{ type: 'io.swagger.annotations.ApiModel', attributes: { value: 'My Model' } }],
    members: [
      {
        annotations: [[{ type: 'io.swagger.annotations.ApiModelProperty', attributes: { value: 'My Name' } }]],
        name: 'name',
        type: 'java.lang.String',
      },
    ],
  };

  const FooEnum: Partial<NadEnum> = {
    name: 'test.FoEnum',
    annotations: [{ type: 'io.swagger.annotations.ApiModel', attributes: { value: 'My Enum' } }],
    constants: [
      {
        name: 'Type1',
        value: 'TYPE1',
        properties: { desc: 'My Type1' },
        annotations: [{ type: 'io.swagger.annotations.ApiModelProperty', attributes: { value: 'My Type1' } }],
      },
      {
        name: 'Type2',
        value: 'TYPE2',
        properties: { desc: 'My Type2' },
        annotations: [{ type: 'io.swagger.annotations.ApiModelProperty', attributes: { value: 'My Type2' } }],
      },
    ],
  };

  const defs = { routes: [foo], classes: [FooModel], enums: [FooEnum] };

  const code = new Builder({ target: 'ts', base: '', defs }).code.replace(/\s+/g, ' ');

  expect(code).toContain(mg`
    /**
     * demo
     * @iface test.Demo
     */
    export const demo = {
  `);

  expect(code).toContain(mg`
    /**
     * My API
     * @param id My ID
     */
    async foo(id?: Long, settings?: Partial<Settings>)
  `);

  expect(code).toContain(mg`
    /**
     * My Model 
     * @iface test.FooModel
     */
    export interface FooModel {
      /**
       * My Name
       */
      name?: string;
    }
  `);
});
