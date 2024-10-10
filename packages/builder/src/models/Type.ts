import { isJavaNonClass } from '../helpers/javaHelper';
import { neverReachHere, LexicalReader, computeIfAbsent } from '../utils';
import { Class } from './Class';
import { Enum } from './Enum';
import type { Root } from './Root';

export type TypeOwner = Class | Root;

const getBuilderFromOwner = (owner: TypeOwner) => {
  if ('root' in owner) return owner.root;
  return owner;
};

const JAVA_OBJECT = 'java.lang.Object';
const JAVA_STRING = 'java.lang.String';
const JAVA_LIST = 'java.util.List';

const wm = new WeakMap<object, TypeOwner>();

export enum TypeUsage {
  defaultType,
  returnType,
  memberType,
  parameterType,
  superType,
}

export class Type {
  public readonly name;
  public readonly parameters;
  public readonly usage;
  public readonly clz;

  private constructor(owner: TypeOwner, usage: TypeUsage, name: string, parameters: readonly Type[]) {
    if (name === '') {
      name = JAVA_OBJECT;
      parameters = [];
    }

    wm.set(this, owner);
    this.usage = usage;
    this.name = name;
    this.parameters = parameters;
    if (isJavaNonClass(name) || this.isGenericVariable) {
      this.clz = null;
    } else {
      this.clz = this.builder.touchDef(name);
    }
  }

  private get owner() {
    const owner = wm.get(this);
    /* istanbul ignore next */
    if (!owner) throw neverReachHere();
    return owner;
  }

  get builder() {
    return getBuilderFromOwner(this.owner);
  }

  get isGenericVariable() {
    if ('typeParameters' in this.owner) {
      return this.owner.typeParameters.includes(this.name);
    }
    return false;
  }

  get isEnum() {
    return this.clz instanceof Enum;
  }

  toString() {
    throw new Error("Don't implicitly convert a Type object to string");
  }

  /**
   * Replace the generic type parameters with the actual types.
   * For example, Map<K, V> replace with { K: String, V: Number } returns Map<String, Number>.
   */
  replace(map: Map<string, Type>): Type {
    const { name } = this;
    const nType = map.get(name);
    if (nType) return nType;
    return new Type(
      this.owner,
      this.usage,
      this.name,
      this.parameters.map((n) => n.replace(map)),
    );
  }

  public static create(rawTypeName: string, owner: TypeOwner): Type;
  public static create(rawTypeName: string, owner: TypeOwner, usage: TypeUsage): Type;
  public static create(rawTypeName: string, owner: TypeOwner, usage = TypeUsage.defaultType) {
    const { typeMapping } = owner.options;
    const sr = new LexicalReader(typeMapping[rawTypeName] || rawTypeName || JAVA_OBJECT);

    const nextNormal = () => {
      let name = sr.read(/[\w$.]*/g);
      let parameters: Type[] = [];
      if (sr.read('<')) {
        do {
          parameters.push(nextParam());
        } while (sr.read(','));
        sr.read(/\s*/g);
        if (!sr.read('>')) {
          throw new SyntaxError(`Cannot parse java type '${rawTypeName}'`);
        }
      }
      if (sr.read('[]')) {
        if (name == 'char' || name === 'byte') {
          parameters = [];
          name = JAVA_STRING;
        } else {
          parameters = [new this(owner, usage, name, parameters)];
          name = JAVA_LIST;
        }
      }
      return new this(owner, usage, name, parameters);
    };

    const nextParam = (): Type => {
      sr.read(/\s*/g);
      if (sr.read('?')) {
        switch (true) {
          case !!sr.read(/\s+extends\s+/g):
            return nextNormal();
          case !!sr.read(/\s+super\s+/g):
            // The <? super XXX> can always match java.lang.Object, regardless of what the XXX is.
            // Therefore, read the next type but never use it.
            nextNormal();
          default:
            return new this(owner, usage, JAVA_OBJECT, []);
        }
      } else {
        return nextNormal();
      }
    };

    return nextParam();
  }
}
