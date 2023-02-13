import { Alert, AlertProps } from 'antd';

export interface ErrorDisplayProps extends AlertProps {
  error: any;
}

export const ErrorDisplay = ({ error, ...rest }: ErrorDisplayProps) => {
  return (
    <Alert
      showIcon
      type='error'
      message={error.name}
      description={error.message}
      {...rest}
    />
  );
};
