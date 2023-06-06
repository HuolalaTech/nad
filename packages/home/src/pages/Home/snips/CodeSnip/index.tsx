import { HTMLAttributes } from 'react';
import { buildCodePre } from 'src/utils/buildCodePre';

import './index.scss';

interface Props extends HTMLAttributes<HTMLDivElement> {
  name: string;
  code: string;
}

export const CodeSnip = ({ name, code, ...props }: Props) => {
  const html = buildCodePre(code, name);
  return <div className='CodeSnip' dangerouslySetInnerHTML={{ __html: html }} {...props} />;
};
