import classNames from 'classnames';
import { cloneElement, FC } from 'react';

export const withClassName = <T>(className: string, fc: FC<T>) => {
  return (...args: Parameters<FC<T>>) => {
    const el = fc(...args);
    if (el === null) return null;
    const { props } = el;
    return cloneElement(el, {
      className: classNames(props?.className, className)
    });
  };
};
