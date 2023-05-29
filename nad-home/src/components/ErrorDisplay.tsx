import { HTMLAttributes } from 'react';

export interface ErrorDisplayProps extends HTMLAttributes<HTMLDivElement> {
  error: any;
}

export const ErrorDisplay = ({ error, ...rest }: ErrorDisplayProps) => {
  return (
    <div {...rest}>
      <div>{error?.name}</div>
      <div>{error?.message}</div>
    </div>
  );
};
