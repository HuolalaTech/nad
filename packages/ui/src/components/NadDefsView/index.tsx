import { useMemo } from 'react';
import { Alert } from 'antd';
import { Aside } from './Aside';
import { Main } from './Main';
import { Context, NadDefsViewContext } from './Context';

import './index.scss';

interface Props {
  defs: any;
  base: string;
}

export const NadDefsViewInternal = ({ defs, base }: Props) => {
  const error = useMemo(() => {
    if (defs === null) {
      return new Error('defs must not be null');
    }
    if (typeof defs !== 'object') {
      return new Error(`defs should be an object but it is a ${typeof defs}.`);
    }
  }, [defs]);

  const context = useMemo(
    () => new NadDefsViewContext(defs, base),
    [defs, base]
  );

  if (error) {
    return (
      <Alert
        showIcon
        type='error'
        message={error.name}
        description={error.message}
      />
    );
  }

  return (
    <Context.Provider value={context}>
      <Aside />
      <Main />
    </Context.Provider>
  );
};

export const NadDefsView = ({ defs, base }: Props) => {
  return (
    <div className='NadDefsView'>
      <NadDefsViewInternal defs={defs} base={base} />
    </div>
  );
};
