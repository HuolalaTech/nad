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

const watches = new Set<(a: {}) => void>();

const dict = new Map<Lang, Entires>();

let lang = document.documentElement.lang.replace(/\W.*/, '') || 'en';

const proxy = new Proxy<Entires>({} as Entires, {
  get(_, key: keyof Entires) {
    let v = dict.get(lang)?.[key];
    if (!v) {
      const l = lang.slice(0, 2);
      v = dict.get(l)?.[key];
    }
    if (!v) {
      v = dict.get('en')?.[key];
    }
    return v || '';
  }
});

export type Lang = typeof lang;

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
