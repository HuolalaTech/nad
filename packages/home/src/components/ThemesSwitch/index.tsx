import './index.scss';
import { MoonIcon } from '../../icons/MoonIcon';
import { SunIcon } from '../../icons/SunIcon';

export const ThemesSwitch = () => {
  return (
    <div
      className='ThemesSwitch'
      onClick={() => {
        const res = document.documentElement.classList.toggle('dark');
        localStorage.setItem('prefers-color-scheme', res ? 'dark' : 'light');
      }}
    >
      <MoonIcon />
      <SunIcon />
    </div>
  );
};
