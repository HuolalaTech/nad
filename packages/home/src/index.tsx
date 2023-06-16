import ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';

import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import properties from 'highlight.js/lib/languages/properties';
import shell from 'highlight.js/lib/languages/shell';
import { navPages } from './constants';

import './index.scss';

hljs.registerLanguage('xml', xml);
hljs.registerLanguage('properties', properties);
hljs.registerLanguage('shell', shell);

const main = () => {
  const element = document.createElement('react-root');
  document.body.appendChild(element);
  const router = createBrowserRouter([
    ...navPages.map((i) => ({ path: i.path, element: i.element })),
    { path: '*', element: <Navigate to='/' replace /> }
  ]);
  const root = ReactDOM.createRoot(element);
  root.render(<RouterProvider router={router} />);
};

if (document.readyState === 'complete') {
  main();
} else {
  window.addEventListener('load', main);
}
