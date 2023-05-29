import classNames from 'classnames';
import { AnchorHTMLAttributes, HTMLAttributes } from 'react';
import './index.scss';
import { Link } from 'react-router-dom';

interface MyBaseProps {
  type?: 'primary';
}

interface AnchorButtonProps
  extends MyBaseProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'type'> {
  href: string;
}

interface StandardButtonProps
  extends HTMLAttributes<HTMLButtonElement>,
    MyBaseProps {}

export type ButtonProps = StandardButtonProps | AnchorButtonProps;

export function Button(props: StandardButtonProps): JSX.Element;
export function Button(props: AnchorButtonProps): JSX.Element;
export function Button({ type, ...props }: ButtonProps) {
  const className = classNames(props.className, type, 'Button');
  if ('href' in props) {
    const { href, ...rest } = props;
    if (/^https?:/.test(href)) {
      return (
        <a {...props} className={className}>
          {props.children}
        </a>
      );
    } else {
      return <Link to={href} {...rest} className={className} />;
    }
  } else {
    return <button {...props} className={className} />;
  }
}
