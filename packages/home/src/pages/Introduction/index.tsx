import { Header } from 'src/components/Header';
import { Footer } from 'src/components/Footer';
import { ArticleView, useArticleSource } from 'src/components/ArticleView';

import zh from './zh.md';
import en from './en.md';

export const Introduction = () => {
  const { data } = useArticleSource({ zh, en });
  return (
    <>
      <Header />
      <ArticleView content={data} />
      {data ? <Footer /> : null}
    </>
  );
};
