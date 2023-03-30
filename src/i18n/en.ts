import { init } from './i18n';

init('en', {
  HOME_SLOGAN_H1: 'Ditch your documentation.',
  HOME_SLOGAN_H2: `Let's communicate with code.`,
  HOME_DESC: `A cross-language interface sharing solution that converts Java interfaces to client-side code.`,
  HOME_PRIMARY_BTN_TEXT: 'Get Started',
  HOME_GIT_BTN_TEXT: 'GitHub',

  HOME_DESCS: [
    {
      icon: 'tube',
      title: 'Bridging the Type System',
      description:
        'Let the front and back ends use a common type system, bringing the advantages of a strongly typed language to bear across languages as well. Any incompatible type changes can be detected at the build stage, effectively avoiding production failures.'
    },
    {
      icon: 'communication',
      title: 'Docking without Document',
      description:
        'The corresponding frontend code is generated based on the backend interface, and the backend interface can be called like a local function. With the comment information and the IDE\'s intelligent prompting, the term "API documentation" will become history.'
    },
    {
      icon: 'model',
      title: 'Model Reuse',
      description:
        'The frontend can directly reuse the business data model defined by the backend. It allows developers at each end to have a common understanding of the business model and avoid structural understanding bias, and also to avoid the duplication of low-value labor.'
    }
  ],

  MENU_HOME: 'Home',
  MENU_INTRODUCTION: 'Introduction',
  COPIED: 'Copied',
  HUOLALA_TECH: 'HuolalaTech',
  RELEASED_UNDER_THE_LICENSE: 'Released under the $1 license'
});
