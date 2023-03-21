import { NadEnum } from '../../types/nad';

export const UserType: NadEnum = {
  name: 'test.UserType',
  constants: [
    { name: 'Admin', value: 'ADMIN', properties: { desc: 'The Admin' }, annotations: [] },
    { name: 'Member', value: 'MEMBER', properties: { desc: 'The Member' }, annotations: [] },
  ],
  annotations: [],
};
