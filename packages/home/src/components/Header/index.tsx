import { NadIcon } from '../../icons/NadIcon';
import { ThemesSwitch } from '../ThemesSwitch';
import { LangsSwitch } from '../LangsSwitch';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { useI18N } from '../../i18n';

import './index.scss';

export const Header = () => {
  const { pathname } = useLocation();
  const i18n = useI18N();

  const menus = [
    { path: '/', text: i18n.MENU_HOME },
    { path: '/introduction', text: i18n.MENU_INTRODUCTION }
  ];

  return (
    <div className='Header'>
      <Link className='logo' to={'/'}>
        <NadIcon />
        <h1>Nad</h1>
      </Link>
      <div className='navbar'>
        {menus.map((i, index) => (
          <Link
            to={i.path}
            className={classNames({ active: pathname === i.path })}
            key={index}
          >
            {i.text}
          </Link>
        ))}
      </div>
      <div style={{ flex: 1 }}></div>
      <div>
        <LangsSwitch />
      </div>
      <div>
        <ThemesSwitch />
      </div>
    </div>
  );
};
