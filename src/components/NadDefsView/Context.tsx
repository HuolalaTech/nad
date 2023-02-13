import { createContext, useContext, useEffect, useReducer } from 'react';

export class NadDefsViewContext {
  public defs;
  public base;
  public apis?: any[];

  public event = new EventTarget();

  public setApis(apis: any[]) {
    this.apis = apis;
    this.event.dispatchEvent(new CustomEvent('update'));
  }

  constructor(defs: any, base: string) {
    this.defs = defs;
    this.base = base;
  }
}

export const Context = createContext<NadDefsViewContext | null>(null);

export const useNadDefsViewContext = () => {
  const context = useContext(Context);

  if (!context) throw new Error('need a NadDefsView context');

  const [, render] = useReducer(() => ({}), {});

  useEffect(() => {
    context.event.addEventListener('update', render);
    return () => context.event.removeEventListener('update', render);
  }, [context, render]);

  return context;
};
