import { useRequest } from 'ahooks';
import { Alert, Button, Form, Input, Spin } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { NadDefsView } from '../../components/NadDefsView';
import { ErrorDisplay } from '../../components/ErrorDisplay';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { ReactNode, useMemo } from 'react';
import { CustomError } from '@huolala-tech/custom-error';
import { loadDefs } from './loadDefs';

import './index.scss';

export class InvalidBaseError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBaseError';
  }
}

const DEFAULT_BASE = '/nad/api/defs';

const useBase = () => {
  const [usp] = useSearchParams();
  return usp.get('base') || DEFAULT_BASE;
};

const InvalidBaseAlert = ({ error }: { error: InvalidBaseError }) => {
  const navigate = useNavigate();
  const base = useBase();
  return (
    <Alert
      type='error'
      showIcon
      message={error.message}
      description={
        <Form
          onFinish={({ base }) => {
            const usp = new URLSearchParams();
            if (base && base !== DEFAULT_BASE) usp.append('base', base);
            navigate({ search: usp.toString() });
          }}
          initialValues={{ base }}
          style={{ marginTop: '20px' }}
        >
          <FormItem name='base' label='API Base'>
            <Input
              placeholder='base'
              style={{ width: 500, marginRight: '1ch' }}
            />
          </FormItem>
          <FormItem style={{ marginBottom: 0 }}>
            <Button htmlType='submit' type='default'>
              Update
            </Button>
          </FormItem>
        </Form>
      }
      style={{ margin: '1em' }}
    />
  );
};

const HomeInternal = () => {
  document.title = window.location.hostname + ' · Nad';
  const base = useBase();

  const { data, error, loading } = useRequest(() => loadDefs(base), {
    refreshDeps: [base]
  });

  const absBase = useMemo(() => {
    if (base.startsWith('/')) return window.location.origin + base;
    return base;
  }, [base]);

  let ed: ReactNode = null;

  if (error instanceof InvalidBaseError) {
    ed = <InvalidBaseAlert error={error} />;
  } else if (error) {
    ed = <ErrorDisplay error={error} style={{ margin: '1em' }} />;
  } else if (!data) {
    ed = <div style={{ height: 300 }}></div>;
  }
  if (ed) return <Spin spinning={loading}>{ed}</Spin>;
  return <NadDefsView defs={data} base={absBase} />;
};

const Header = () => {
  return (
    <div className='header'>
      <svg
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 1024 1024'
        className='logo'
      >
        <polygon points='432,915 649,630 271,699 467,427 125,507 271,213 19,282 0,205 0,1024 972,1024 918,828 ' />
        <polygon points='461,58 309,361 705,269 497,556 885,485 667,771 990,713 1024,834 1024,0 51,0 91,159 ' />
      </svg>
      <h1>Nad</h1>
      <div style={{ flex: 1 }}></div>
      <a
        href='https://github.com/HuolalaTech/nad'
        target='_blank'
        rel='noreferrer'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='12 12 40 40'
          className='github'
        >
          <path d='M32 13.4c-10.5 0-19 8.5-19 19 0 8.4 5.5 15.5 13 18 1 .2 1.3-.4 1.3-.9v-3.2c-5.3 1.1-6.4-2.6-6.4-2.6-.9-2.1-2.1-2.7-2.1-2.7-1.7-1.2.1-1.1.1-1.1 1.9.1 2.9 2 2.9 2 1.7 2.9 4.5 2.1 5.5 1.6.2-1.2.7-2.1 1.2-2.6-4.2-.5-8.7-2.1-8.7-9.4 0-2.1.7-3.7 2-5.1-.2-.5-.8-2.4.2-5 0 0 1.6-.5 5.2 2 1.5-.4 3.1-.7 4.8-.7 1.6 0 3.3.2 4.7.7 3.6-2.4 5.2-2 5.2-2 1 2.6.4 4.6.2 5 1.2 1.3 2 3 2 5.1 0 7.3-4.5 8.9-8.7 9.4.7.6 1.3 1.7 1.3 3.5v5.2c0 .5.4 1.1 1.3.9 7.5-2.6 13-9.7 13-18.1 0-10.5-8.5-19-19-19z' />
        </svg>
      </a>
    </div>
  );
};

export const Home = () => {
  return (
    <div className='Home'>
      <Header />
      <HomeInternal />
    </div>
  );
};
