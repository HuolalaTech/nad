import { HTMLAttributes } from 'react';
import { withClassName } from '../../../../utils/withClassName';
import { buildCodePre } from 'src/utils/buildCodePre';

import './index.scss';

interface Props extends HTMLAttributes<HTMLDivElement> {
  name: string;
  code: string;
}

export const CodeSnip = withClassName(
  'CodeSnip',
  ({ name, code, ...props }: Props) => {
    const html = buildCodePre(code, name);
    return <div dangerouslySetInnerHTML={{ __html: html }} {...props} />;
  }
);
