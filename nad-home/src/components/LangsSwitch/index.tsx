import { setLanguage, useLang } from '../../i18n';
import { LanguageIcon } from '../../icons/LanguageIcon';

import './index.scss';

export const LangsSwitch = () => {
  const lang = useLang();
  return (
    <LanguageIcon
      className='LangsSwitch'
      onClick={() => {
        if (lang.startsWith('en')) setLanguage('zh');
        else setLanguage('en');
      }}
    />
  );
};
