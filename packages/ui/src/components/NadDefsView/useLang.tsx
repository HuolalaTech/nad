import { SupportedTarget, supportedTargets } from '@huolala-tech/nad-builder';
import { useSearchParams } from 'react-router-dom';

const isSupportedType = (w: unknown): w is SupportedTarget =>
  supportedTargets.includes(w as SupportedTarget);

export const useLang = () => {
  const [usp] = useSearchParams();
  const lang = usp.get('lang');
  if (isSupportedType(lang)) return lang;
  return 'ts' as const;
};
