import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { hl } from './hl';
import { useLang } from './useLang';
import { Button, Select } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DownloadOutlined } from '@ant-design/icons';
import { Builder } from '@huolala-tech/nad-builder';
import { useNadDefsViewContext } from './Context';
import { TextFragmentFinder } from './TextFragmentFinder';
import { makeRange } from './makeRange';

const langs = [
  { value: 'ts', label: 'TypeScript', exn: 'ts' },
  { value: 'oc', label: 'Objective-C', exn: 'm' }
];

const Header = ({ code }: { code: string }) => {
  const lang = useLang();
  const [usp] = useSearchParams();
  const navigate = useNavigate();
  return (
    <div className='header'>
      <Select
        onSelect={(key) => {
          const u = new URLSearchParams(usp);
          u.set('lang', key);
          navigate({ search: u.toString() });
        }}
        options={langs}
        value={lang}
      />
      <Button
        icon={<DownloadOutlined />}
        onClick={() => {
          const url = URL.createObjectURL(
            new Blob([code], { type: 'text/plain' })
          );
          const a = document.createElement('a');
          a.href = url;
          const { exn = 'unknown' } = langs.find((i) => i.value === lang) || {};
          a.download = window.location.hostname + '.' + exn;
          a.click();
        }}
      >
        Download
      </Button>
    </div>
  );
};

export const Main = () => {
  const context = useNadDefsViewContext();
  const { defs, base, apis } = context;
  const lang = useLang();

  const builder = useMemo(() => {
    const fixedBase = base.replace(/\/nad\/api\/defs$/, '');
    return new Builder({ target: lang, defs, base: fixedBase, apis });
  }, [defs, base, lang, apis]);

  const { code, root } = builder;

  const html = useMemo(() => {
    return hl(code.toString(), lang);
  }, [code, lang]);

  const ref = useRef<HTMLElement>(null);

  const [tff, setTff] = useState<TextFragmentFinder>();
  useEffect(() => {
    const { current } = ref;
    if (!current) return;
    setTff(new TextFragmentFinder(current));
    current.scrollTop = 0;
  }, [html]);

  const selectRange = useCallback(
    (api: string) => {
      if (!api || !tff) return;
      const selection = document.getSelection();
      if (!selection) return;
      const { current } = ref;
      if (!current) return;
      selection.removeAllRanges();
      // Select all and reset scroll bar.
      if (api === '*') {
        const range = document.createRange();
        range.selectNode(current);
        selection.addRange(range);
        current.scrollTop = 0;
        return;
      }
      // Find text and select range and scroll into range center.
      const [, iface, methodName] = api.match(/^(.*?)(?:::(.*))?$/) || [];
      const controller = root.modules.find((r) => r.name === iface);
      if (!controller) return;
      let range;
      if (methodName) {
        const method = controller.routes.find((a) => a.uniqName === methodName);
        if (!method) return;
        range = makeRange(tff, lang, controller.moduleName, method.uniqName);
      } else {
        range = makeRange(tff, lang, controller.moduleName);
      }
      if (!range) return;
      selection.addRange(range);
      const rect = range.getBoundingClientRect();
      const margin = Math.max((current.offsetHeight - rect.height) / 2, 20);
      current.scrollTop += rect.top - margin;
    },
    [root, lang, tff]
  );

  context.useEventListener('selectApi', (e) => {
    if (!(e instanceof CustomEvent)) return;
    const { detail } = e;
    if (typeof detail !== 'string') return;
    selectRange(detail);
  });

  return (
    <main ref={ref}>
      <Header code={code} />
      <pre>
        <code dangerouslySetInnerHTML={{ __html: html }}></code>
      </pre>
    </main>
  );
};
