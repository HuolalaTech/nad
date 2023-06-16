import { useRequest } from 'ahooks';
import { request } from '@huolala-tech/request';

import { useLang } from 'src/i18n';
import { Header } from 'src/components/Header';
import { Footer } from 'src/components/Footer';
import { ArticleView } from 'src/components/ArticleView';

import zh from './zh.md';
import en from './en.md';

export const Introduction = () => {
  const lang = useLang();

  const { data } = useRequest(
    async () => {
      const { data, statusCode } = await request({
        method: 'GET',
        url: lang === 'zh' ? zh : en,
        responseType: 'text',
        withCredentials: false
      });
      if (statusCode !== 200) throw new Error('error');
      return data;
    },
    {
      refreshDeps: [lang]
    }
  );

  return (
    <>
      <Header />
      <ArticleView content={data} />
      {data ? <Footer /> : null}
    </>
  );
};
