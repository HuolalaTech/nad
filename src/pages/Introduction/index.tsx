import { useRequest } from 'ahooks';
import { request } from '@huolala-tech/request';

import { useLang } from 'src/i18n';
import { Header } from 'src/components/Header';
import { Footer } from 'src/components/Footer';
import { Loading } from 'src/components/Loading';
import { MdParser } from './MdParser';
import { Menu } from './Menu';
import { Article } from './Article';

import zh from './zh.md';
import en from './en.md';

import './index.scss';

export const Introduction = () => {
  const lang = useLang();

  const { data } = useRequest(
    async () => {
      // await new Promise((f) => setTimeout(f, 10000));
      const { data, statusCode } = await request<string>({
        method: 'GET',
        url: lang === 'zh' ? zh : en,
        responseType: 'text'
      });
      if (statusCode !== 200) throw new Error('error');
      return new MdParser(data);
    },
    {
      refreshDeps: [lang]
    }
  );

  return (
    <>
      <Header />
      <div className='Introduction'>
        {data ? (
          <>
            <Menu data={data} />
            <Article data={data} />
          </>
        ) : (
          <Loading />
        )}
      </div>
      {data ? <Footer /> : null}
    </>
  );
};
