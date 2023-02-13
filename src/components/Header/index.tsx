import {
  DownOutlined,
  ExperimentOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import classNames from 'classnames';
import type { HTMLAttributes } from 'react';
import { Link, useLocation } from 'react-router-dom';

import './index.scss';
import logoSvg from '../../assets/logo.svg';

export const Header = (props: HTMLAttributes<HTMLDivElement>) => {
  const location = useLocation();
  const activeKey = location.pathname;
  return (
    <div {...props} className={classNames(props.className, 'Header')}>
      <Link to='/home' className='logo'>
        <img src={logoSvg} alt='logo' width={24} />
        <span>YYDS</span>
      </Link>
      <Menu
        mode='horizontal'
        overflowedIndicator={false}
        selectable={false}
        activeKey={activeKey}
        items={[
          {
            key: 'menu',
            icon: <DownOutlined />,
            label: 'Menu',
            children: [
              {
                key: '/home',
                label: (
                  <Link className='Header__item' to='/home'>
                    Home
                  </Link>
                ),
                icon: <HomeOutlined />
              },
              {
                key: '/demo',
                label: (
                  <Link className='Header__item' to='/demo'>
                    Demo
                  </Link>
                ),
                icon: <ExperimentOutlined />
              }
            ]
          }
        ]}
      />
      <div style={{ flex: 1 }}></div>
      <div>USER</div>
    </div>
  );
};
