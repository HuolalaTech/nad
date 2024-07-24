import { Module } from './Module';
import { Class } from './Class';
import { computeIfAbsent, Dubious, toUpperCamel, parseDsv, UniqueName, removeDynamicSuffix, notEmpty } from '../utils';
import { u2o, u2a, u2s } from 'u2x';
import { Enum } from './Enum';
import { NadResult } from '../types/nad';
import { RouteRaw } from './Route';
import { RootOptions } from './RootOptions';
import { CommonDefs } from './CommonDefs';

export type RawDefs = Dubious<NadResult>;

export class Root {
  private readonly rawClassMap;
  private readonly derivationMap;
  private readonly rawEnumMap;
  private readonly rawModuleMap;

  private readonly classes: Record<string, Class>;
  private readonly enums: Record<string, Enum>;

  public readonly options;

  public readonly commonDefs;
  public readonly unknownTypes;
  public readonly modules;

  public readonly uniqueNameSeparator;

  constructor(raw: RawDefs, options: Partial<RootOptions> = {}) {
    this.options = new RootOptions(options);

    const rawClasses = u2a(raw.classes, u2o);
    this.rawClassMap = new Map(rawClasses.map((i) => [u2s(u2o(i).name), i]));

    this.derivationMap = rawClasses.reduce((map, clz) => {
      const { superclass, interfaces, name } = clz;
      if (typeof name !== 'string') return map;
      [superclass]
        .concat(interfaces)
        .map((s) => u2s(s))
        .filter(notEmpty)
        .map((n) => n.replace(/\<.*/, ''))
        .filter((n) => this.rawClassMap.has(n))
        .forEach((n) => computeIfAbsent(map, n, () => []).push(name));
      return map;
    }, new Map<string, string[]>());

    this.rawEnumMap = new Map(u2a(raw.enums, (i) => [u2s(u2o(i).name), i]));
    this.rawModuleMap = new Map(u2a(raw.modules, (i) => [u2s(u2o(i).name), i]));

    this.classes = Object.create(null);
    this.enums = Object.create(null);
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

  get declarationList() {
    return Object.values(this.classes);
  }

  get enumList() {
    return Object.values(this.enums);
  }

  get moduleCount() {
    return this.modules.length;
  }
  get defCount() {
    return Object.keys(this.classes).length;
  }
  get apiCount() {
    return this.modules.reduce((s, i) => s + i.routes.length, 0);
  }

  public getDefByName(name: string): Enum | Class | null {
    const { classes, rawClassMap: rawClasses, enums, rawEnumMap: rawEnums } = this;
    if (name in classes) return classes[name];
    if (name in enums) return enums[name];
    let raw = rawClasses.get(name);
    if (raw) {
      const clz = new Class(raw, this);
      classes[name] = clz;
      clz.spread();
      return clz;
    }
    raw = rawEnums.get(name);
    if (raw) {
      const en = new Enum(raw, this);
      enums[name] = en;
      return en;
    }
    this.unknownTypes.add(name);
    return null;
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

  public findDerivativedTypes(rawTypeName: unknown) {
    if (typeof rawTypeName !== 'string') return [];
    // TODO: Support generic type matching.
    const list = this.derivationMap.get(rawTypeName);
    if (!list) return [];
    return list;
  }
}
