import { NadRoute } from '../../types/nad';
import { Builder } from '../../Builder';
import { MULTIPART_FORM_DATA, WWW_FORM_URLENCODED } from '../../constants';
import { ss } from '../../helpers/tsHelper';

const MY_PROTOCOL = 'application/x-my-protocol';

const buildCodeByConsumers = (consumes: string[]) => {
  const foo: Partial<NadRoute> = {
    name: 'foo',
    bean: 'test.Demo',
    returnType: 'java.lang.Long',
    consumes,
  };
  const { code } = new Builder({ target: 'ts', base: '', defs: { routes: [foo], classes: [] } });
  return code;
};

test('single consumers', () => {
  const code = buildCodeByConsumers([MY_PROTOCOL]);
  expect(code).toContain(`.addHeader('Content-Type', ${ss(MY_PROTOCOL)})`);
});

test(`consumers has ${WWW_FORM_URLENCODED}`, () => {
  const code = buildCodeByConsumers([MY_PROTOCOL, WWW_FORM_URLENCODED]);
  expect(code).toContain(`.addHeader('Content-Type', ${ss(WWW_FORM_URLENCODED)})`);
});

test(`consumers has ${MULTIPART_FORM_DATA}`, () => {
  const code = buildCodeByConsumers(['application/x-my-protocol', MULTIPART_FORM_DATA]);
  expect(code).toContain(`.addHeader('Content-Type', ${ss(MULTIPART_FORM_DATA)})`);
});

test(`consumers has a number item`, () => {
  const code = buildCodeByConsumers([123 as unknown as string, MY_PROTOCOL]);
  expect(code).toContain(`.addHeader('Content-Type', ${ss(MY_PROTOCOL)})`);
});

test(`consumers has a bad item`, () => {
  const code = buildCodeByConsumers(['hehe', MY_PROTOCOL]);
  expect(code).toContain(`.addHeader('Content-Type', ${ss(MY_PROTOCOL)})`);
});
