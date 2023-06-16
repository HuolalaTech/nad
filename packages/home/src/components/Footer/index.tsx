import { renderTemplate, useI18N } from 'src/i18n';
import './index.scss';

export const Footer = () => {
  const { HUOLALA_TECH, RELEASED_UNDER_THE_LICENSE } = useI18N();
  return (
    <div className='Footer'>
      <div>
        {renderTemplate(
          RELEASED_UNDER_THE_LICENSE,
          <a href='https://opensource.org/licenses/MIT' target='_blank' rel='noreferrer' translate='no'>
            MIT
          </a>
        )}
      </div>
      <div>Copyright &copy; 2023 {HUOLALA_TECH}</div>
    </div>
  );
};
