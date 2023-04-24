import { isJavaNonClass } from '../helpers/javaHelper';
import { neverReachHere, SyntaxReader } from '../utils';
import type { Class } from './Class';
import type { Root } from './Root';

export type TypeOwner = Class | Root;

const JAVA_OBJECT = 'java.lang.Object';

const wm = new WeakMap<object, TypeOwner>();

export class Type {
  public readonly name;
  public readonly parameters;
  public readonly clz;

  private constructor(owner: TypeOwner, name: string, parameters: readonly Type[]) {
    wm.set(this, owner);
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
    const { owner, name: type, parameters } = this;
    const nType = map.get(type);
    if (nType) return nType;
    return new Type(
      owner,
      type,
      parameters.map((n) => n.replace(map)),
    );
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
