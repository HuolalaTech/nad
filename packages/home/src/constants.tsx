import { Entires } from './i18n';
import { Home } from './pages/Home';
import { Introduction } from './pages/Introduction';

interface NavPage {
  path: string;
  key: keyof Entires['NAV_MENU'];
  element: JSX.Element;
}

export const navPages: NavPage[] = [
  { path: '/', key: 'HOME', element: <Home /> },
  { path: '/introduction', key: 'INTRODUCTION', element: <Introduction /> }
];
