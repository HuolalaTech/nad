import { SVGAttributes } from 'react';

export const LanguageIcon = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      version='1.1'
      viewBox='0 0 1024 1024'
      {...props}
    >
      <path d='M547 638l-104-103 1-1a720 720 0 0 0 152-268h120V183h-287V100H347v82H59V265h459a648 648 0 0 1-130 219 643 643 0 0 1-94-137H211a722 722 0 0 0 122 187l-209 206 58 58 205-205 127 127 31-83m231-208h-82l-184 493h82l46-123h195l46 123h82l-185-493m-107 287l66-178 66 178z'></path>
    </svg>
  );
};
