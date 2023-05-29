import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { MdParser } from './MdParser';

export const Article = ({ data }: { data: MdParser }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { hash } = useLocation();

  useEffect(() => {
    const { current } = ref;
    if (!current) return;
    if (!hash) return;
    let el;
    try {
      el = current.querySelector(hash);
    } catch (e) {
      return;
    }
    if (!el) return;
    const { top } = el.getBoundingClientRect();
    document.documentElement.scrollBy({ top: top - 66, behavior: 'smooth' });
    const div = document.createElement('div');
    div.className = 'flashing';
    el.append(div);
    const [a] = div.getAnimations();
    if (a) a.addEventListener('finish', () => div.remove());
  }, [hash]);

  return <article dangerouslySetInnerHTML={{ __html: data.html }} ref={ref} />;
};
