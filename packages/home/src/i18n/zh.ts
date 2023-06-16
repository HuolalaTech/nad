import { init } from './i18n';

init('zh', {
  HOME_SLOGAN_H1: '丢掉你的文档',
  HOME_SLOGAN_H2: '让我们用代码来沟通',
  HOME_DESC: `一种将 Java 接口转成客户端代码的\n跨语言接口共享解决方案`,
  HOME_PRIMARY_BTN_TEXT: '开始使用',
  HOME_GIT_BTN_TEXT: 'GitHub',

  HOME_DESCS: [
    {
      icon: 'tube',
      title: '打通类型系统',
      description: '跨语言使用同样的类型系统，让前后端的代码零成本无缝对接'
    },
    {
      icon: 'communication',
      title: '无文档对接',
      description: 'IDE 直接提示绝对准确的接口参数和字段含义，无需额外查阅文档'
    },
    {
      icon: 'model',
      title: '模型复用',
      description: '后端定义好的数据模型在前端直接复用，无需重复理解业务'
    }
  ],

  MENU_HOME: '首页',
  MENU_INTRODUCTION: '介绍',
  COPIED: '已复制',
  HUOLALA_TECH: '货拉拉科技',
  RELEASED_UNDER_THE_LICENSE: '基于 $1 开源协议发布'
});
