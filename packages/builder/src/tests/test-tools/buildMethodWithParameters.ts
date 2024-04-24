import { NadAnnotation, NadParameter, NadRoute } from '../../types/nad';
import { DeepPartial } from '../../utils';
import { Builder } from '../../Builder';
import { User } from '../defs/User';
import { UserType } from '../defs/UserType';

export const buildMethodWithAnnotations = (target: 'oc' | 'ts', ...annotations: DeepPartial<NadAnnotation>[]) => {
  const foo: DeepPartial<NadRoute> = {
    name: 'foo',
    bean: 'test.Demo',
    parameters: [],
    annotations,
    returnType: 'java.lang.Long',
  };
  const defs = { routes: [foo], classes: [User], enums: [UserType] };
  const { code } = new Builder({ target, base: '', defs });
  return code.replace(/\s+/g, ' ');
};

export const buildMethodWithParameters = (target: 'oc' | 'ts', ...parameters: DeepPartial<NadParameter>[]) => {
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

export const buildTsMethodWithParameters = (...parameters: DeepPartial<NadParameter>[]) =>
  buildMethodWithParameters('ts', ...parameters);

export const buildOcMethodWithParameters = (...parameters: DeepPartial<NadParameter>[]) =>
  buildMethodWithParameters('oc', ...parameters);

export const buildTsMethodWithAnnotations = (...parameters: DeepPartial<NadAnnotation>[]) =>
  buildMethodWithAnnotations('ts', ...parameters);

export const buildOcMethodWithAnnotations = (...parameters: DeepPartial<NadAnnotation>[]) =>
  buildMethodWithAnnotations('oc', ...parameters);
