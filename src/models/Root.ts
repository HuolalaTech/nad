import { Module } from './Module';
import { Class } from './Class';
import { computeIfAbsent, Dubious, u2o } from '../utils';
import { u2a, u2s } from '../utils';
import { Enum } from './Enum';
import { NadResult } from '../types/nad';
import { RouteRaw } from './Route';

export interface BuilderOptions {
  uniqueNameSeparator?: string;
  apis?: string[];
  fixClassName?: (s: string) => string;
  fixModuleName?: (s: string) => string;
  fixApiName?: (s: string) => string;
  fixPropertyName?: (s: string) => string;
}

export type RawDefs = Dubious<NadResult>;

export class Root {
  private readonly rawClasses;
  private readonly rawEnums;
  private readonly rawModules;
  private readonly classes: Record<string, Class>;
  private readonly enums: Record<string, Enum>;

  public readonly commonDefs: Record<string, string>;
  public readonly unknownTypes;
  public readonly modules;

  public readonly uniqueNameSeparator;

  public readonly fixClassName;
  public readonly fixModuleName;
  public readonly fixApiName;
  public readonly fixPropertyName;

  constructor(raw: RawDefs, options: BuilderOptions = {}) {
    this.rawClasses = new Map(u2a(raw.classes, (i) => [u2s(u2o(i).name), i]));
    this.rawEnums = new Map(u2a(raw.enums, (i) => [u2s(u2o(i).name), i]));
    this.rawModules = new Map(u2a(raw.modules, (i) => [u2s(u2o(i).name), i]));

    this.classes = Object.create(null);
    this.enums = Object.create(null);

    this.commonDefs = Object.create(null);
    this.uniqueNameSeparator = options.uniqueNameSeparator;

    this.fixClassName = options.fixClassName || ((s: string) => s.replace(/\$.*/, ''));
    this.fixModuleName = options.fixModuleName || ((s: string) => s.replace(/\$.*/, ''));
    this.fixApiName = options.fixApiName || ((s: string) => s.replace(/\$.*/, ''));
    this.fixPropertyName = options.fixPropertyName || ((s: string) => s.replace(/\$.*/, ''));

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
      ([name, list]) => new Module(this.rawModules.get(name) || { name }, this, list),
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
    const { classes, rawClasses, enums, rawEnums } = this;
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

  public getDefBySimpleName(name: string): Enum | Class | null {
    return (
      this.declarationList.find((def) => def.simpleName === name) ||
      this.enumList.find((def) => def.simpleName === name) ||
      null
    );
  }

  public isEnum(name: string) {
    return this.rawEnums.has(name);
  }
}
