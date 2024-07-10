import { isJavaNonClass } from '../helpers/javaHelper';
import { neverReachHere, LexicalReader } from '../utils';
import type { Class } from './Class';
import type { Root } from './Root';

export type TypeOwner = Class | Root;

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
  public readonly isExtending;
  public readonly name;
  public readonly parameters;
  public readonly usage;
  public readonly clz;

  private constructor(
    owner: TypeOwner,
    usage: TypeUsage,
    isExtending: boolean,
    name: string,
    parameters: readonly Type[],
  ) {
    if (name === '') {
      name = JAVA_OBJECT;
      parameters = [];
    }

    wm.set(this, owner);
    this.usage = usage;
    this.isExtending = isExtending;
    this.name = name;
    this.parameters = parameters;
    if (isJavaNonClass(name) || this.isGenericVariable) {
      this.clz = null;
    } else {
      this.clz = this.builder.getDefByName(name);
    }
  }

  get owner() {
    const owner = wm.get(this);
    /* istanbul ignore next */
    if (!owner) throw neverReachHere();
    return owner;
  }

  get builder() {
    const { owner } = this;
    if ('builder' in owner) return owner.builder;
    return owner;
  }

  get isGenericVariable() {
    if ('typeParameters' in this.owner) {
      return this.owner.typeParameters.includes(this.name);
    }
    return false;
  }

  get isEnum() {
    return this.builder.isEnum(this.name);
  }

  toString() {
    throw new Error("Don't implicitly convert a Type object to string");
  }

  /**
   * Replace the generic type parameters with the actual types.
   * For example, Map<K, V> replace with { K: String, V: Number } returns Map<String, Number>.
   */
  replace(map: Map<string, Type>): Type {
    const { owner, name: type, parameters, isExtending, usage } = this;
    const nType = map.get(type);
    if (nType) return nType;
    return new Type(
      owner,
      usage,
      isExtending,
      type,
      parameters.map((n) => n.replace(map)),
    );
  }

  public static create(rawTypeName: string, owner: TypeOwner): Type;
  public static create(rawTypeName: string, owner: TypeOwner, usage: TypeUsage): Type;
  public static create(rawTypeName: string, owner: TypeOwner, usage = TypeUsage.defaultType) {
    const { typeMapping } = owner.options;
    const sr = new LexicalReader(typeMapping[rawTypeName] || rawTypeName || JAVA_OBJECT);

    const nextNormal = ({ isExtending }: { isExtending: boolean }) => {
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
          parameters = [new Type(owner, usage, false, name, parameters)];
          name = JAVA_LIST;
        }
      }
      return new this(owner, usage, isExtending, name, parameters);
    };

    const nextParam = (): Type => {
      sr.read(/\s*/g);
      if (sr.read('?')) {
        switch (true) {
          case !!sr.read(/\s+extends\s+/g):
            return nextNormal({ isExtending: true });
          case !!sr.read(/\s+super\s+/g):
            nextParam(); // read next but never use
          default:
            return new this(owner, usage, false, JAVA_OBJECT, []);
        }
      } else {
        return nextNormal({ isExtending: false });
      }
    };

    return nextParam();
  }
}
