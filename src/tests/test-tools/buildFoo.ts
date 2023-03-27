import { NadParameter, NadRoute } from 'src/types/nad';
import { Builder } from '../../Builder';
import { User } from '../defs/User';
import { UserType } from '../defs/UserType';

export const buildFoo = (target: 'oc' | 'ts', ...parameters: NadParameter[]) => {
  const foo: NadRoute = {
    name: 'foo',
    bean: 'test.Demo',
    headers: [],
    parameters,
    annotations: [],
    returnType: 'java.lang.Long',
    consumes: [],
    methods: [],
    patterns: [],
    produces: [],
  };
  const defs = { routes: [foo], classes: [User], enums: [UserType] };
  const { code } = new Builder({ target, base: '', defs });
  return code.replace(/\s+/g, ' ');
};

export const buildTsFoo = (...parameters: NadParameter[]) => buildFoo('ts', ...parameters);

export const buildOcFoo = (...parameters: NadParameter[]) => buildFoo('oc', ...parameters);
