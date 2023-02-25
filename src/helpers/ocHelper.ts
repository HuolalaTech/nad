import { neverReachHere } from '../utils';
import type { BuilderOptions } from '../models/Root';
import { Class } from '../models/Class';
import type { Type } from '../models/Type';

// Convert value to safe string in code
export const ss = (s: string | number) => {
  if (typeof s === 'string') {
    return `@"${s.replace(/["\\\r\n]/g, (i) => `\\x${i.charCodeAt(0).toString(16)}`)}"`;
  }
  if (typeof s === 'number') {
    return `@${s}`;
  }
  throw neverReachHere(s);
};

export const checkSuper = (sub: Class, sup: Class): boolean => {
  const clz = sub.superclass?.clz;
  if (!clz || !(clz instanceof Class)) return false;
  if (clz === sup) return true;
  return checkSuper(clz, sup);
};

export const t2s = (type: Type): string => {
  const { name, isGenericVariable } = type;

  if (isGenericVariable) return name;

  if (type.isString) return 'NSString';
  if (type.isNumber) return 'NSNumber';
  if (type.isBoolean) return 'NSNumber';
  if (type.isList) {
    const first = type.parameters[0];
    if (!first) return `NSArray<NSObject*>`;
    let t = t2s(first);
    if (!first.isGenericVariable) t = `${t}*`;
    return `NSArray<${t}>`;
  }
  if (type.isMap) return `NSDictionary`;
  if (type.isUnknown) return 'NSObject';
  if (type.isVoid) return 'void';

  const { clz, parameters } = type;
  if (!clz) return 'NSObject';

  const { simpleName } = clz;
  if (clz instanceof Class) {
    const { typeParameters } = clz;
    if (typeParameters.length > 0) {
      const pars = typeParameters
        .map((_, i: number) => {
          const t = parameters[i];
          if (t && !t.isVoid) {
            return t2s(t) + (t.isGenericVariable ? '' : '*');
          }
          return 'NSObject*';
        })
        .join(', ');
      return `${simpleName}<${pars}>`;
    }
  }
  return simpleName;
};

const preservedKeywords = new Set(['default', 'signed']);
export const ocBuilderOptions: Partial<BuilderOptions> = {
  uniqueNameSeparator: '_',
  fixPropertyName: (name: string) => {
    const n = name.replace(/\$.*/, '');
    if (preservedKeywords.has(n)) return `_${n}`;
    return n;
  },
};
