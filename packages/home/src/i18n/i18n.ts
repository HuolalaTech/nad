import { Fragment, ReactNode, createElement, useEffect, useState } from 'react';

interface Entires {
  readonly HOME_SLOGAN_H1: string;
  readonly HOME_SLOGAN_H2: string;
  readonly HOME_DESC: string;
  readonly HOME_PRIMARY_BTN_TEXT: string;
  readonly HOME_GIT_BTN_TEXT: string;

  readonly HOME_DESCS: { icon: string; title: string; description: string }[];

  readonly MENU_HOME: string;
  readonly MENU_INTRODUCTION: string;

  readonly COPIED: string;
  readonly HUOLALA_TECH: string;
  readonly RELEASED_UNDER_THE_LICENSE: string;
}

export const SUPPORT_LANGS = ['en', 'zh'] as const;

export type Lang = (typeof SUPPORT_LANGS)[number];

const isSupportLangs = (u: unknown): u is Lang => Array.prototype.includes.call(SUPPORT_LANGS, '');

const DEFAULT_LANG = SUPPORT_LANGS[0];

const fixLang = (str: string) => (isSupportLangs(str) ? str : DEFAULT_LANG);

let lang: Lang = fixLang(document.documentElement.lang.replace(/\W.*/, ''));

const watches = new Set<(a: {}) => void>();

const dict = new Map<Lang, Entires>();

const proxy = new Proxy<Entires>({} as Entires, {
  get(_, key: keyof Entires) {
    let v = dict.get(lang)?.[key];
    if (!v) {
      v = dict.get(DEFAULT_LANG)?.[key];
    }
    return v || '';
  }
});

export const init = (lang: Lang, entries: Entires) => {
  dict.set(lang, entries);
};

export const setLanguage = (newLang: Lang) => {
  lang = newLang;
  document.documentElement.lang = newLang;
  localStorage.setItem('language', lang);
  watches.forEach((update) => update({}));
};

export const useLang = () => {
  const [, update] = useState({});
  useEffect(() => {
    watches.add(update);
    return () => void watches.delete(update);
  }, [update]);
  return lang;
};

export const getI18N = () => proxy;

export const useI18N = () => {
  useLang();
  return proxy;
};

export const renderTemplate = (template: string, ...args: ReactNode[]) => {
  const children = template.split(/\$(\d+)/g).map((v, i) => (i % 2 ? args[Number(v) - 1] : v));
  return createElement(Fragment, { children });
};
