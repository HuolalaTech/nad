import { NadIcon } from '../../icons/NadIcon';
import { ThemesSwitch } from '../ThemesSwitch';
import { LangsSwitch } from '../LangsSwitch';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { useI18N } from '../../i18n';
import { navPages } from 'src/constants';

import './index.scss';

export const Header = () => {
  const { pathname } = useLocation();
  const i18n = useI18N();

  return (
    <div className='Header'>
      <Link className='logo' to={'/'}>
        <NadIcon />
        <h1 translate='no'>Nad</h1>
      </Link>
      <div className='navbar'>
        {navPages.map(({ path, key }) => (
          <Link to={path} className={classNames({ active: pathname === path })} key={key}>
            {i18n.NAV_MENU[key]}
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
