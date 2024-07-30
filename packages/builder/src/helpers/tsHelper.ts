import { neverReachHere } from '../utils/neverReachHere';
import { Class } from '../models/Class';
import type { Type } from '../models/Type';
import {
  isJavaBoolean,
  isJavaList,
  isJavaLong,
  isJavaMap,
  isJavaNumber,
  isJavaString,
  isJavaTuple,
  isJavaUnknown,
  isJavaVoid,
  isJavaWrapper,
} from './javaHelper';
import { toLowerCamel } from '../utils';
import { RootOptions } from '../models/RootOptions';
import { Enum, TypeUsage } from '../models';

// Convert value to safe string in code
export const ss = (u: string | number | boolean) => {
  if (typeof u === 'string') {
    return `'${String(u).replace(/['\\\r\n]/g, (char) => {
      const code = char.charCodeAt(0);
      return code < 0x10 ? `\\x0${code.toString(16)}` : `\\x${code.toString(16)}`;
    })}'`;
  }
  if (typeof u === 'number') {
    return String(u);
  }
  if (typeof u === 'boolean') {
    return String(u);
  }
  throw neverReachHere(u);
};

const TS_UNKNOWN = 'unknown';

const uTypeCache: Record<string, true | undefined> = Object.create(null);
const isUnionType = (type: string) => type in uTypeCache;
export const buildUnionType = (...types: string[]) => {
  const uType = types.join(' | ');
  if (types.length > 1) uTypeCache[uType] = true;
  return uType;
};

export const t2s = (type: Type | undefined): string => {
  if (!type) return TS_UNKNOWN;
  const { name, parameters, isGenericVariable, builder } = type;

  if (isGenericVariable) return name;

  const { commonDefs } = builder;

  switch (name) {
    case 'java.math.BigDecimal':
      return commonDefs.BigDecimal();
    case 'java.math.BigInteger':
      return commonDefs.BigInteger();
    case 'org.springframework.web.multipart.MultipartFile':
      return commonDefs.MultipartFile();
    default:
  }
  if (isJavaLong(name)) {
    return commonDefs.Long();
  }
  if (isJavaNumber(name)) return 'number';
  if (isJavaString(name)) return 'string';
  if (isJavaBoolean(name)) return 'boolean';
  if (isJavaVoid(name)) return 'void';
  if (isJavaMap(name)) {
    const [first, second] = parameters;
    const { Nullable } = commonDefs;
    if (first && first.isEnum) {
      return `Partial<Record<${t2s(first)}, ${Nullable(t2s(second))}>>`;
    } else if (first && (isJavaString(first.name) || isJavaNumber(first.name))) {
      return `Record<${t2s(first)}, ${Nullable(t2s(second))}>`;
    } else {
      return `Record<PropertyKey, ${Nullable(t2s(second))}>`;
    }
  }
  if (isJavaList(name)) {
    const t = t2s(parameters[0]);
    if (isUnionType(t)) {
      return `Array<${t}>`;
    } else {
      return `${t}[]`;
    }
  }
  if (isJavaWrapper(name)) {
    const [first] = parameters;
    if (first) {
      return commonDefs.Nullable(t2s(first));
    } else {
      return TS_UNKNOWN;
    }
  }
  if (isJavaTuple(name)) {
    return `[ ${parameters.map(t2s).join(', ')} ]`;
  }
  if (isJavaUnknown(name)) return TS_UNKNOWN;

  const { clz } = type;
  if (!clz) return TS_UNKNOWN;

  if (clz instanceof Class) {
    const { typeParameters, simpleName } = clz;
    let t = simpleName;
    if (typeParameters.length > 0) {
      const pars = typeParameters.map((_, i) => t2s(parameters[i])).join(', ');
      t += `<${pars}>`;
    }

    if (type.usage === TypeUsage.superType) return t;

    const { derivativedTypes } = clz;
    if (derivativedTypes.length === 0) return t;
    if (derivativedTypes.length === 1 && clz.isInterface) return t;
    const ts = derivativedTypes.map(t2s);
    if (!clz.isInterface) ts.push(t);
    return buildUnionType(...ts);
  }
  if (clz instanceof Enum) {
    return clz.simpleName;
  }

  /* istanbul ignore next */
  throw neverReachHere();
};

export const tsBuilderOptions: Partial<RootOptions> = {
  uniqueNameSeparator: '$',
  fixModuleName: (s) => toLowerCamel(s) || 'unknownModule',
};
