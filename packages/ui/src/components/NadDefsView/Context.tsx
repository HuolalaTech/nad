import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef
} from 'react';

export class NadDefsViewContext {
  public defs;
  public base;
  public apis?: any[];

  private eventTarget = new EventTarget();

  public useEventListener(name: string, handler: (e: Event) => void) {
    /* eslint-disable react-hooks/rules-of-hooks */
    const { eventTarget } = this;
    const ref = useRef(handler);
    ref.current = handler;
    const persistentHandler = useCallback((event: Event) => {
      ref.current(event);
    }, []);
    useEffect(() => {
      eventTarget.addEventListener(name, persistentHandler);
      return () => eventTarget.removeEventListener(name, persistentHandler);
    }, [name, persistentHandler, eventTarget]);
  }

  public selectApi(api: string) {
    this.eventTarget.dispatchEvent(
      new CustomEvent('selectApi', { detail: api })
    );
  }

  public setApis(apis: any[]) {
    this.apis = apis;
    this.eventTarget.dispatchEvent(new CustomEvent('update'));
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

  context.useEventListener('update', render);

  return context;
};
