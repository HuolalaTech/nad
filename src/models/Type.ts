import type { TypeOwner } from './TypeBase';
import { TypeBase } from './TypeBase';

import type { DefBase } from './DefBase';
import { computeIfAbsent } from '../utils';
import {
  isJavaNumber,
  isJavaString,
  isJavaLong,
  isJavaInteger,
  isJavaFloat,
  isJavaBoolean,
  isJavaMap,
  isJavaList,
  isJavaNonClass,
  isJavaVoid,
  isJavaUnknown,
} from '../helpers/javaHelper';
import { SyntaxReader } from './SyntaxReader';

const clzCache = new WeakMap<Type, DefBase | null>();
const JAVA_OBJECT = 'java.lang.Object';

export class Type extends TypeBase<Type> {
  private getClz() {
    this.parameters.forEach((i) => i.getClz());
    if (isJavaNonClass(this.name) || this.isGenericVariable) return null;
    return this.builder.getDefByName(this.name);
  }

  get clz(): DefBase | null {
    return computeIfAbsent(clzCache, this, (n) => n.getClz());
  }

  toString() {
    throw new Error("Don't implicitly convert a Type object to string");
  }

  /**
   * Replace the generic type parameters with the actual types.
   * For example, Map<K, V> replace with { K: String, V: Number } returns Map<String, Number>.
   */
  replace(map: Map<string, Type>): Type {
    const { owner, name: type, parameters } = this;
    const nType = map.get(type);
    if (nType) return nType;
    return new Type(
      owner,
      type,
      parameters.map((n) => n.replace(map)),
    );
  }

  get isNumber() {
    return isJavaNumber(this.name);
  }

  get isString() {
    return isJavaString(this.name);
  }

  get isLong() {
    return isJavaLong(this.name);
  }

  get isInteger() {
    return isJavaInteger(this.name);
  }

  get isFloat() {
    return isJavaFloat(this.name);
  }

  get isBoolean() {
    return isJavaBoolean(this.name);
  }

  get isMap() {
    return isJavaMap(this.name);
  }

  get isList() {
    return isJavaList(this.name);
  }

  get isNonClass() {
    return isJavaNonClass(this.name);
  }

  get isVoid() {
    return isJavaVoid(this.name);
  }

  get isUnknown() {
    return isJavaUnknown(this.name);
  }

  public static create(typeName: string, owner: TypeOwner) {
    const sr = new SyntaxReader(typeName || JAVA_OBJECT);
    const next = () => {
      sr.read(/\s*/g);
      const name = sr.read(/[\w$.?]*/g);
      const parameters: Type[] = [];
      if (sr.read('<')) {
        do {
          parameters.push(next());
        } while (sr.read(','));
        sr.read('>'); // need assert
      }
      const cr = () => {
        if (name === 'java.lang.ThreadLocal' || name === 'java.util.Optional') return parameters[0];
        if (name === '?' || name === '') return new this(owner, JAVA_OBJECT, []);
        return new this(owner, name, parameters);
      };
      if (sr.read('[]')) {
        if (name == 'char' || name === 'byte') {
          return new this(owner, 'java.lang.String', []);
        }
        return new this(owner, 'java.util.List', [cr()]);
      }
      return cr();
    };
    return next();
  }
}
