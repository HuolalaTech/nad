import { MouseEventHandler } from 'react';
import { useLocation, useNavigate } from 'react-router';
import classNames from 'classnames';
import { MdParser } from './MdParser';

export const Menu = ({ data }: { data: MdParser }) => {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const click: MouseEventHandler<HTMLLIElement> = (e) => {
    navigate({ hash: e.currentTarget.dataset.id });
  };

  return (
    <aside>
      <ul>
        {data.menu.map((i, index) => {
          const { id, text, level } = i;
          return (
            <li
              key={index}
              role='button'
              data-id={id}
              className={classNames({ active: `#${id}` === hash })}
              onClick={click}
            >
              <div style={{ paddingLeft: level + 'em' }}>{text}</div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
