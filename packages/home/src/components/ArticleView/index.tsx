import { Loading } from 'src/components/Loading';
import { MdParser } from './MdParser';
import { Menu } from './Menu';
import { Article } from './Article';
import { HTMLAttributes, useMemo } from 'react';
import './index.scss';
import classNames from 'classnames';

interface ArticleViewProps extends HTMLAttributes<HTMLDivElement> {
  content?: string;
}

export const ArticleView = ({ content, className, ...rest }: ArticleViewProps) => {
  const mp = useMemo(() => (content !== undefined ? new MdParser(content) : null), [content]);
  return (
    <div className={classNames(className, 'ArticleView')} {...rest}>
      {mp ? (
        <>
          <Menu data={mp} />
          <Article data={mp} />
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};
