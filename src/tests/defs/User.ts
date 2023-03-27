import { NadClass } from '../../types/nad';

export const User: NadClass = {
  name: 'test.User',
  members: [
    {
      annotations: [],
      name: 'name',
      type: 'java.lang.String',
    },
    {
      annotations: [],
      name: 'age',
      type: 'int',
    },
    {
      annotations: [],
      name: 'memo',
      type: 'test.UserType',
    },
  ],
  superclass: 'java.lang.Object',
  interfaces: [],
  typeParameters: [],
  annotations: [],
};
