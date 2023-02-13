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

export const Home = () => {
  return (
    <div className='Home'>
      <HomeInternal />
    </div>
  );
};
