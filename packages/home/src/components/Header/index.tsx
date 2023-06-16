import { NadIcon } from '../../icons/NadIcon';
import { ThemesSwitch } from '../ThemesSwitch';
import { LangsSwitch } from '../LangsSwitch';
import { Link, LinkProps, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { useI18N } from '../../i18n';

import './index.scss';

export const Header = () => {
  const { pathname } = useLocation();
  const i18n = useI18N();

  const menus: LinkProps[] = [
    { to: '/', children: i18n.MENU_HOME, translate: 'no' },
    { to: '/introduction', children: i18n.MENU_INTRODUCTION }
  ];

  return (
    <div className='Header'>
      <Link className='logo' to={'/'}>
        <NadIcon />
        <h1 translate='no'>Nad</h1>
      </Link>
      <div className='navbar'>
        {menus.map(({ to, ...rest }, index) => (
          <Link to={to} className={classNames({ active: pathname === to })} key={index} {...rest} />
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
