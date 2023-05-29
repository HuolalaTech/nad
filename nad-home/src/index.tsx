import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Introduction } from './pages/Introduction';

import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import properties from 'highlight.js/lib/languages/properties';
import shell from 'highlight.js/lib/languages/shell';

import './index.scss';

hljs.registerLanguage('xml', xml);
hljs.registerLanguage('properties', properties);
hljs.registerLanguage('shell', shell);

const main = () => {
  const element = document.createElement('react-root');
  document.body.appendChild(element);
  const root = ReactDOM.createRoot(element);
  root.render(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/introduction' element={<Introduction />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
};

if (document.readyState === 'complete') {
  main();
} else {
  window.addEventListener('load', main);
}
