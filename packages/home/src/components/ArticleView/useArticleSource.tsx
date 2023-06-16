import { useRequest } from 'ahooks';
import { request } from '@huolala-tech/request';
import { Lang, useLang } from 'src/i18n';

type PathMap = {
  [p in Lang]: string;
};

export const useArticleSource = (pathMap: PathMap) => {
  const lang = useLang();
  return useRequest(
    async () => {
      const { data, statusCode } = await request({
        method: 'GET',
        url: pathMap[lang],
        responseType: 'text',
        withCredentials: false
      });
      if (statusCode !== 200) throw new Error(`HTTP ${statusCode}`);
      return data;
    },
    {
      refreshDeps: [lang]
    }
  );
};
