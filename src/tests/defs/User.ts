import { NadClass } from '../../types/nad';

export const User: NadClass = {
  name: 'test.User',
  annotations: [{ type: 'io.swagger.annotations.ApiModel', attributes: { value: 'User' } }],
  members: [
    {
      annotations: [[{ type: 'io.swagger.annotations.ApiModelProperty', attributes: { value: 'Name' } }]],
      name: 'name',
      type: 'java.lang.String',
    },
    {
      annotations: [[{ type: 'io.swagger.annotations.ApiModelProperty', attributes: { name: 'Age' } }]],
      name: 'age',
      type: 'int',
    },
    {
      annotations: [[{ type: 'io.swagger.annotations.ApiModelProperty', attributes: {} }]],
      name: 'memo',
      type: 'test.UserType',
    },
  ],
  superclass: 'java.lang.Object',
  interfaces: [],
  typeParameters: [],
};
