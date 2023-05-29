import { CustomError } from '@huolala-tech/custom-error';
import { Button } from 'src/components/Button';
import { useI18N } from 'src/i18n';
import { GitHubIcon } from 'src/icons/GitHubIcon';
import { CodePanel } from './CodePanel';
import { Header } from 'src/components/Header';
import { Footer } from 'src/components/Footer';

import * as assets from 'src/assets';

import './index.scss';

export class InvalidBaseError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBaseError';
  }
}

const MainPart = () => {
  const i18n = useI18N();
  return (
    <div className='center'>
      <CodePanel />
      <div className='left'>
        <h1>{i18n.HOME_SLOGAN_H1}</h1>
        <h2>{i18n.HOME_SLOGAN_H2}</h2>
        <p>{i18n.HOME_DESC}</p>
        <div className='buttons'>
          <Button type='primary' href='/introduction#sec-2'>
            {i18n.HOME_PRIMARY_BTN_TEXT}
          </Button>
          <Button href='https://github.com/HuolalaTech/nad-java-sdk' target='_blank'>
            <GitHubIcon />
            {i18n.HOME_GIT_BTN_TEXT}
          </Button>
        </div>
      </div>
    </div>
  );
};

const TailPart = () => {
  const { HOME_DESCS } = useI18N();
  return (
    <div className='descs'>
      {HOME_DESCS.map(({ icon, title, description }, index) => {
        const src = assets[icon as keyof typeof assets];
        return (
          <div key={String(index)}>
            <h3>
              <img src={src} alt={icon} />
              <span>{title}</span>
            </h3>
            <p>{description}</p>
          </div>
        );
      })}
    </div>
  );
};

export const Home = () => {
  return (
    <>
      <Header />
      <div className='Home'>
        <MainPart />
        <TailPart />
      </div>
      <Footer />
    </>
  );
};
