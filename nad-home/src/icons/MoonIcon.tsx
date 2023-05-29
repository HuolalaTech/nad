import { SVGAttributes } from 'react';

export const MoonIcon = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      version='1.1'
      viewBox='0 0 1024 1024'
      {...props}
    >
      <path d='M 427 181 Q 426 197 426 213 a 384 384 0 0 0 384 384 q 16 0 32 -1 a 341 341 0 1 1 -414 -414 M 512 85 a 426 426 0 1 0 426 426 c 0 -9 0 -18 -1 -28 a 298 298 0 0 1 -397 -397 A 445 445 0 0 0 512 85 Z' />
    </svg>
  );
};
