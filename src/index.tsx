import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import './index.scss';

const main = () => {
  const element = document.createElement('react-root');
  document.body.appendChild(element);
  const root = ReactDOM.createRoot(element);
  root.render(
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

if (document.readyState === 'complete') {
  main();
} else {
  window.addEventListener('load', main);
}
