import { DeepPartial } from '../../utils';
import { NadClass } from '../../types/nad';

export const User: DeepPartial<NadClass> = {
  name: 'test.User',
  members: [
    { name: 'name', type: 'java.lang.String' },
    { name: 'age', type: 'int' },
    { name: 'memo', type: 'test.UserType' },
  ],
  superclass: 'java.lang.Object',
};
