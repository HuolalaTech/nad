import { Module } from './Module';
import { Class } from './Class';
import { computeIfAbsent } from '../utils';
import { toArray, toString } from '../utils';
import { Enum } from './Enum';
import type { DefBase } from './DefBase';

export interface BuilderOptions {
  uniqueNameSeparator?: string;
  apis?: string[];
  fixClassName?: (s: string) => string;
  fixModuleName?: (s: string) => string;
  fixApiName?: (s: string) => string;
  fixPropertyName?: (s: string) => string;
}

export interface RawDefs {
  routes?: unknown[];
  classes?: unknown[];
  enums?: unknown[];
}

export class Root {
  private readonly rawClasses;
  private readonly rawEnums;
  private readonly classes: Record<string, Class>;
  private readonly enums: Record<string, Enum>;

  public readonly commonDefs: Record<string, string>;
  public readonly unknownTypes;
  public readonly routes;

  public readonly uniqueNameSeparator;

  public readonly fixClassName;
  public readonly fixModuleName;
  public readonly fixApiName;
  public readonly fixPropertyName;

  constructor(raw: RawDefs, options: BuilderOptions = {}) {
    this.rawClasses = new Map(toArray(raw?.classes, (i) => [toString(Object(i).name), i]));
    this.rawEnums = new Map(toArray(raw?.enums, (i) => [toString(Object(i).name), i]));
    this.classes = {};
    this.enums = {};

    this.commonDefs = {};
    this.uniqueNameSeparator = options.uniqueNameSeparator;

    this.fixClassName = options.fixClassName || ((s: string) => s.replace(/\$.*/, ''));
    this.fixModuleName = options.fixModuleName || ((s: string) => s.replace(/\$.*/, ''));
    this.fixApiName = options.fixApiName || ((s: string) => s.replace(/\$.*/, ''));
    this.fixPropertyName = options.fixPropertyName || ((s: string) => s.replace(/\$.*/, ''));

    this.unknownTypes = new Set<string>();

    const groups = toArray(raw?.routes || [])
      .filter((rawRoute) => {
        if (!options.apis) return true;
        const { bean, name } = Object(rawRoute);
        const kw = `${bean}.${name}`;
        return options.apis.some((i) => kw.includes(i));
      })
      .reduce((map: Map<string, unknown[]>, i) => {
        const { bean } = Object(i);
        if (typeof bean === 'string') {
          computeIfAbsent(map, bean, () => [] as unknown[]).push(i);
        }
        return map;
      }, new Map<string, unknown[]>());
    this.routes = Array.from(groups.entries(), ([name, list]) => new Module(name, list, this));
  }

  get declarationList() {
    return Object.values(this.classes);
  }

  get enumList() {
    return Object.values(this.enums);
  }

  get moduleCount() {
    return this.routes.length;
  }
  get defCount() {
    return Object.keys(this.classes).length;
  }
  get apiCount() {
    return this.routes.reduce((s, i) => s + i.apis.length, 0);
  }

  getDefByName(name: string): DefBase | null {
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

  getClassBySimpleName(name: string): Class | null {
    return this.declarationList.find((clz) => clz.simpleName === name) || null;
  }
}
