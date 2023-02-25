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

const clzCache = new WeakMap<Type, DefBase | null>();

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

  static create(typeName: string, owner: TypeOwner) {
    const input = typeName || 'java.lang.Object';
    try {
      const stack: Type[] = [];
      let index = 0;
      stack[index] = new this(owner);
      for (let i = 0; i < input.length; i++) {
        switch (input[i]) {
          case '<':
            stack[++index] = new this(owner);
            stack[index - 1].parameters.push(stack[index]);
            break;
          case '>':
            index--;
            // "ThreadLocal<T>"" is equals "T"
            // "Optional<T>"" is equals "T"
            if (stack[index].name === 'java.lang.ThreadLocal' || stack[index].name === 'java.util.Optional') {
              const [T] = stack[index].parameters;
              if (index - 1 >= 0) {
                const found = stack[index - 1].parameters.indexOf(stack[index]);
                if (found !== -1) stack[index - 1].parameters[found] = T;
              }
              stack[index] = T;
            }
            break;
          case ',':
            stack[index] = new this(owner);
            stack[index - 1].parameters.push(stack[index]);
            break;
          case '\n':
          case ' ':
            break;
          case '[':
            break;
          case ']':
            // The java type "char[]" serialized as a string.
            if (stack[index].name === 'char' || stack[index].name === 'byte') {
              stack[index].name = 'java.lang.String';
            } else {
              stack[index] = new this(owner, 'java.util.List', [stack[index]]);
              if (index) stack[index - 1].parameters.splice(-1, 1, stack[index]);
            }
            break;
          case '?':
            stack[index].name = 'java.lang.Object';
            break;
          default:
            stack[index].name += input[i];
        }
      }
      const type = stack[0];
      type.getClz();
      return type;
    } catch (error) {
      throw new SyntaxError(`Faild to create GenericType with input '${input}'`);
    }
  }
}
