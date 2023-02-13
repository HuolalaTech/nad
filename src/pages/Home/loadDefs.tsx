import { request } from '@huolala-tech/request';
import { InvalidBaseError } from './index';

export const loadDefs = async (url: string) => {
  const res = await request({ method: 'GET', url });
  const { statusCode } = res;
  if (statusCode === 404) {
    throw new InvalidBaseError(
      `Got a 404 status from "${url}", most likely the request API base is invalid`
    );
  }
  if (statusCode === 0) {
    throw new InvalidBaseError(
      `Fail to fetch "${url}", most likely the request API base is invalid`
    );
  }
  if (statusCode !== 200) throw new Error(`Got a ${statusCode} from "${url}"`);
  const ct = res.headers['content-type'];
  if (ct && !/\bjson\b/.test(ct))
    throw new InvalidBaseError(
      `Got a "${ct}" from "${url}", most likely the request API base is invalid`
    );
  return res.data;
};
