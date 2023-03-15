import { NadInvoker } from '../NadInvoker';
import { interceptors } from '@huolala-tech/request';

import './libs/mock-xhr';

test('addExtension', async () => {
  const obj = { a: 1, b: true };
  interceptors.request.use((args) => {
    const { custom, headers } = Object(args);
    if (custom) {
      headers['a'] = String(custom.a);
      headers['b'] = String(custom.b);
    }
  });
  const res = await new NadInvoker().open('GET', '/test').addExtension('custom', obj).execute();
  expect(res).toMatchObject({
    method: 'GET',
    url: '/test',
    headers: {
      a: '1',
      b: 'true',
    },
  });
});
