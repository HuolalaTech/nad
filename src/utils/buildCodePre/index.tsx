import hljs from 'highlight.js';
import './index.scss';
import { getI18N } from 'src/i18n';

window.addEventListener('click', (event) => {
  for (
    let { target } = event;
    target && target instanceof HTMLElement;
    target = target.parentNode
  ) {
    if (target.dataset.language) {
      navigator.clipboard.writeText(target.textContent || '');
      const { clientX, clientY } = event;
      const div = document.createElement('div');
      div.textContent = getI18N().COPIED;
      div.style.left = clientX + 'px';
      div.style.top = clientY + 'px';
      div.className = 'copied';
      div.addEventListener('animationend', () => {
        div.remove();
      });
      document.body.appendChild(div);
      break;
    }
  }
});

export const buildCodePre = (
  code: string,
  name: string | undefined
): string => {
  const language = name?.replace(/.*\./, '') || 'unknown';
  const { value } = hljs.highlight(code, { language });
  return `<pre data-name="${name}" data-language="${language}" translate="no">${value}</pre>`;
};
