import { neverReachHere } from '../utils';
import type { BuilderOptions } from '../builder/Builder';
import { Class } from '../builder/Class';
import type { Type } from '../builder/Type';

// Convert value to safe string in code
export const ss = (s: string | number) => {
  if (typeof s === 'string') {
    return `'${String(s).replace(/['\\\r\n]/g, (i) => `\\x${i.charCodeAt(0).toString(16)}`)}'`;
  }
  if (typeof s === 'number') {
    return String(s);
  }
  throw neverReachHere(s);
};

export const t2s = (type: Type): string => {
  if (!type) return 'any';
  const { name, parameters, isGenericVariable, builder } = type;

  if (isGenericVariable) return name;

  switch (name) {
    case 'long':
    case 'java.lang.Long':
      builder.commonDefs.Long = 'string | number';
      return 'Long';
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

  if (type.isString) return 'string';
  if (type.isNumber) return 'number';
  if (type.isBoolean) return 'boolean';
  if (type.isVoid) return 'void';
  if (type.isUnknown) return 'any';
  if (type.isMap) {
    const [first, second] = parameters;
    let keyType = 'any';
    if (first && (first.isString || first.isNumber || first.isEnum)) {
      keyType = t2s(first);
    }
    return `Record<${keyType}, ${t2s(second) || 'any'}>`;
  }

  if (type.isList) {
    return `${t2s(parameters[0]) || 'any'}[]`;
  }

  const { clz } = type;
  if (!clz) return 'any';

  const { simpleName } = clz;
  if (clz instanceof Class) {
    const { typeParameters } = clz;
    if (typeParameters.length > 0) {
      const pars = typeParameters.map((_, i) => t2s(parameters[i]) || 'any').join(', ');
      return `${simpleName}<${pars}>`;
    }
  }
  return simpleName;
};

export const tsBuilderOptions: Partial<BuilderOptions> = {
  uniqueNameSeparator: '$',
  fixModuleName: (name: string) => name[0].toLowerCase() + name.slice(1),
};
