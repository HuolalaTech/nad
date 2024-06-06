import { neverReachHere } from '../utils';
import { Class } from '../models/Class';
import type { Type } from '../models/Type';
import {
  isJavaBoolean,
  isJavaList,
  isJavaMap,
  isJavaNumber,
  isJavaString,
  isJavaTuple,
  isJavaUnknown,
  isJavaVoid,
} from './javaHelper';
import { RootOptions } from 'src/models/RootOptions';

// Convert value to safe string in code
export const ss = (s: string | number) => {
  if (typeof s === 'string') {
    return `@"${s.replace(/["\\\r\n]/g, (char) => {
      const code = char.charCodeAt(0);
      return code < 0x10 ? `\\x0${code.toString(16)}` : `\\x${code.toString(16)}`;
    })}"`;
  }
  if (typeof s === 'number') {
    return `@${s}`;
  }
  throw neverReachHere(s);
};

export const checkSuper = (sub: Class, sup: Class): boolean => {
  const clz = sub.superclass.clz;
  if (!clz || !(clz instanceof Class)) return false;
  if (clz === sup) return true;
  return checkSuper(clz, sup);
};

export const t2s = (type: Type): string => {
  const { name, isGenericVariable } = type;

  if (isGenericVariable) return name;

  if (isJavaString(name)) return 'NSString';
  if (isJavaNumber(name)) return 'NSNumber';
  if (isJavaBoolean(name)) return 'NSNumber';
  if (isJavaVoid(name)) return 'void';
  if (isJavaList(name)) {
    const first = type.parameters[0];
    if (!first) return `NSArray<NSObject*>`;
    let t = t2s(first);
    if (!first.isGenericVariable) t = `${t}*`;
    return `NSArray<${t}>`;
  }
  if (isJavaMap(name)) return `NSDictionary`;
  if (isJavaTuple(name)) return 'NSArray<NSObject*>';
  if (isJavaUnknown(name)) return 'NSObject';

  const { clz, parameters } = type;
  if (!clz) return 'NSObject';

  const { simpleName } = clz;
  if (clz instanceof Class) {
    const { typeParameters } = clz;
    if (typeParameters.length > 0) {
      const pars = typeParameters
        .map((_, i: number) => {
          const t = parameters[i];
          if (t && !isJavaVoid(t.name)) {
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
export const ocBuilderOptions: Partial<RootOptions> = {
  uniqueNameSeparator: '_',
  fixPropertyName: (name: string) => {
    const n = name.replace(/\$.*/, '');
    if (preservedKeywords.has(n)) return `_${n}`;

    return n;
  },
};
