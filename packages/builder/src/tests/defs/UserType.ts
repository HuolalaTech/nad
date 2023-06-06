import { DeepPartial } from '../../utils';
import { NadEnum } from '../../types/nad';

export const UserType: DeepPartial<NadEnum> = {
  name: 'test.UserType',
  constants: [
    { name: 'Admin', value: 'ADMIN', properties: { desc: 'The Admin' } },
    { name: 'Member', value: 'MEMBER', properties: { desc: 'The Member' } },
  ],
};
