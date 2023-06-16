import { SUPPORT_LANGS, setLanguage, useLang } from '../../i18n';
import { LanguageIcon } from 'src/icons/LanguageIcon';

import './index.scss';

export const LangsSwitch = () => {
  const lang = useLang();
  return (
    <LanguageIcon
      className='LangsSwitch'
      onClick={() => {
        const index = (SUPPORT_LANGS.indexOf(lang) + 1) % SUPPORT_LANGS.length;
        setLanguage(SUPPORT_LANGS[index]);
      }}
    />
  );
};
