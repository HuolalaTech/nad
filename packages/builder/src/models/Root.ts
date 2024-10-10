import { Module } from './Module';
import { Class } from './Class';
import { computeIfAbsent, Dubious, toUpperCamel, parseDsv, UniqueName, removeDynamicSuffix, assert } from '../utils';
import { u2o, u2a, u2s } from 'u2x';
import { Enum } from './Enum';
import { NadResult } from '../types/nad';
import { RouteRaw } from './Route';
import { RootOptions } from './RootOptions';
import { CommonDefs } from './CommonDefs';

export type RawDefs = Dubious<NadResult>;

export class Root {
  private readonly classMap;
  private readonly derivationMap;
  private readonly enumMap;
  private readonly rawModuleMap;

  private readonly activeDefs;

  public readonly options;

  public readonly commonDefs;
  public readonly unknownTypes;
  public readonly modules;

  public readonly uniqueNameSeparator;

  constructor(raw: RawDefs, options: Partial<RootOptions> = {}) {
    this.options = new RootOptions(options);

    this.enumMap = new Map(u2a(raw.enums, (i) => new Enum(i, this)).map((d) => [d.name, d] as const));
    this.classMap = new Map(u2a(raw.classes, (i) => new Class(i, this)).map((d) => [d.name, d] as const));
    this.derivationMap = this.buildDerivationMap();
    this.rawModuleMap = new Map(u2a(raw.modules, (i) => [u2s(u2o(i).name), i]));

    this.activeDefs = new Set<Class | Enum>();

    this.commonDefs = new CommonDefs();
    this.uniqueNameSeparator = options.uniqueNameSeparator;

    this.unknownTypes = new Set<string>();

    const groups = u2a(raw.routes || [])
      .filter((rawRoute) => {
        if (!options.apis) return true;
        const { bean, name } = u2o(rawRoute);
        const kw = `${bean}.${name}`;
        return options.apis.some((i) => kw.includes(i));
      })
      .reduce((map: Map<string, RouteRaw[]>, i) => {
        const { bean } = u2o(i);
        if (typeof bean === 'string') {
          computeIfAbsent(map, bean, () => [] as RouteRaw[]).push(i);
        }
        return map;
      }, new Map<string, RouteRaw[]>());

    this.modules = Array.from(
      groups.entries(),
      ([name, list]) => new Module(this.rawModuleMap.get(name) || { name }, this, list),
    );
  }

  private buildDerivationMap() {
    const { classMap: rawClassMap } = this;

    // For example:
    //
    // If the classes defining like this:
    // ```java
    // class Animal<T> {}
    // class Dog extends Animal<String> {}
    // class Cat extends Animal<Integer> {}
    // ```
    //
    // The map result will be:
    //
    // { 'Animal': { Dog => 'Animal<String>', Cat => 'Animal<Integer>' } }
    //
    const map = new Map<string, Map<Class, string>>();
    for (const [, clz] of rawClassMap) {
      for (const n of clz.bounds) {
        const sn = n.replace(/\<.*/, '');
        if (!rawClassMap.has(sn)) continue;
        const item = computeIfAbsent(map, n, () => new Map<Class, string>());
        item.set(clz, n);
      }
    }

    return map;
  }

  public get classList() {
    return [...this.activeDefs].filter((i): i is Class => i instanceof Class);
  }

  public get enumList() {
    return [...this.activeDefs].filter((i): i is Enum => i instanceof Enum);
  }

  public get moduleCount() {
    return this.modules.length;
  }

  public get defCount() {
    return this.activeDefs.size;
  }

  public get apiCount() {
    return this.modules.reduce((s, i) => s + i.routes.length, 0);
  }

  /**
   * This method can only be called from Type.
   */
  public touchDef(name: string): Enum | Class | null;
  public touchDef<T extends Enum | Class>(def: T): T;
  public touchDef(what: string | Enum | Class): Enum | Class | null {
    if (typeof what === 'string') {
      const { classMap, enumMap } = this;
      what = classMap.get(what) || enumMap.get(what) || what;
    }

    if (what instanceof Enum || what instanceof Class) {
      const { activeDefs } = this;
      if (activeDefs.has(what)) return what;
      activeDefs.add(what);
      what.spread();
      return what;
    }

    this.unknownTypes.add(what);
    return null;
  }

  public isUsing(def: Enum | Class) {
    return this.activeDefs.has(def);
  }

  public takeUniqueName(javaClassPath: string, fixFunction: (s: string) => string) {
    // Concat the java package path before name, while the class name is already in use.
    const { uniqueNameSeparator } = this;
    const path = removeDynamicSuffix(javaClassPath);
    let name = '';
    for (const next of parseDsv(path)) {
      name = toUpperCamel(next) + name;
      if (name && !UniqueName.lookupFor(this, fixFunction(name))) break;
    }
    return UniqueName.createFor(this, fixFunction(name), uniqueNameSeparator);
  }

  public *findDerivativedRefs(name: string, depth = 0): Iterable<[Class, string]> {
    assert(depth < 20, 'Too many nested derivative class: ' + name);
    for (const [clz, usage] of this.derivationMap.get(name) ?? []) {
      yield [clz, usage];
      yield* this.findDerivativedRefs(clz.name, depth + 1);
    }
  }
}
