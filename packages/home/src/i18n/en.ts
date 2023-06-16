import { init } from './i18n';

init('en', {
  HOME_SLOGAN_H1: 'Ditch your documentation',
  HOME_SLOGAN_H2: `Let's communicate with code`,
  HOME_DESC: `A cross-language interface sharing solution that converts Java interfaces to client-side code`,
  HOME_PRIMARY_BTN_TEXT: 'Get Started',
  HOME_GIT_BTN_TEXT: 'GitHub',

  HOME_DESCS: [
    {
      icon: 'tube',
      title: 'Bridging the Type System',
      description:
        'Use the same type system across languages for seamless frontend and backend code integration at zero cost'
    },
    {
      icon: 'communication',
      title: 'Docking without Document',
      description:
        'IDE directly prompts for absolutely accurate interface parameters and field meanings, no need to consult additional documentation'
    },
    {
      icon: 'model',
      title: 'Model Reuse',
      description:
        'The backend defined data model is directly reused in the frontend, no need to repeat to understand the business'
    }
  ],

  MENU_HOME: 'Home',
  MENU_INTRODUCTION: 'Introduction',
  COPIED: 'Copied',
  HUOLALA_TECH: 'HuolalaTech',
  RELEASED_UNDER_THE_LICENSE: 'Released under the $1 license'
});
