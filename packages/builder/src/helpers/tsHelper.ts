import { neverReachHere } from '../utils/neverReachHere';
import type { BuilderOptions } from '../models/Root';
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
} from './javaHelper';
import { toLowerCamel } from '../utils';

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

export const t2s = (type: Type): string => {
  if (!type) return 'any';
  const { name, parameters, isGenericVariable, builder } = type;

  if (isGenericVariable) return name;

  switch (name) {
    case 'java.math.BigDecimal':
      builder.commonDefs.BigDecimal = 'string | number';
      return 'BigDecimal';
    case 'java.math.BigInteger':
      builder.commonDefs.BigInteger = 'string | number';
      return 'BigInteger';
    case 'org.springframework.web.multipart.MultipartFile':
      builder.commonDefs.MultipartFile = 'Blob | File | string';
      return 'MultipartFile';
    default:
  }
  if (isJavaLong(name)) {
    builder.commonDefs.Long = 'string | number';
    return 'Long';
  }
  if (isJavaNumber(name)) return 'number';
  if (isJavaString(name)) return 'string';
  if (isJavaBoolean(name)) return 'boolean';
  if (isJavaVoid(name)) return 'void';
  if (isJavaMap(name)) {
    const [first, second] = parameters;
    let keyType = 'any';
    if (first && (isJavaString(first.name) || isJavaNumber(first.name) || first.isEnum)) {
      keyType = t2s(first);
    }
    return `Record<${keyType}, ${t2s(second)}>`;
  }
  if (isJavaList(name)) {
    return `${t2s(parameters[0])}[]`;
  }
  if (isJavaTuple(name)) {
    return `[ ${parameters.map(t2s).join(', ')} ]`;
  }
  if (isJavaUnknown(name)) return 'any';

  const { clz } = type;
  if (!clz) return 'any';

  const { simpleName: simpleName } = clz;
  if (clz instanceof Class) {
    const { typeParameters } = clz;
    if (typeParameters.length > 0) {
      const pars = typeParameters.map((_, i) => t2s(parameters[i])).join(', ');
      return `${simpleName}<${pars}>`;
    }
  }
  return simpleName;
};

export const tsBuilderOptions: Partial<BuilderOptions> = {
  uniqueNameSeparator: '$',
  fixModuleName: (s) => toLowerCamel(s) || 'unknownModule',
};
