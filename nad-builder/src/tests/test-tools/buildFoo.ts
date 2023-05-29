import { NadParameter, NadRoute } from '../../types/nad';
import { DeepPartial } from '../../utils';
import { Builder } from '../../Builder';
import { User } from '../defs/User';
import { UserType } from '../defs/UserType';

export const buildFoo = (target: 'oc' | 'ts', ...parameters: DeepPartial<NadParameter>[]) => {
  const foo: DeepPartial<NadRoute> = {
    name: 'foo',
    bean: 'test.Demo',
    parameters,
    returnType: 'java.lang.Long',
  };
  const defs = { routes: [foo], classes: [User], enums: [UserType] };
  const { code } = new Builder({ target, base: '', defs });
  return code.replace(/\s+/g, ' ');
};

export const buildTsFoo = (...parameters: DeepPartial<NadParameter>[]) => buildFoo('ts', ...parameters);

export const buildOcFoo = (...parameters: DeepPartial<NadParameter>[]) => buildFoo('oc', ...parameters);
