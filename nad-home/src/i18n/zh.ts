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
      description:
        '让前后端使用同一套类型系统，将强类型语言的优势在跨语言上也发挥到淋漓尽致。任何一处类型不兼容的改动都能够在构建阶段发现，有效避免生产故障。'
    },
    {
      icon: 'communication',
      title: '无文档对接',
      description:
        '基于后端接口生成了对应的前端代码，可以像调用本地函数一样调用后端接口。配合上注释信息以及 IDE 的智能提示，「接口文档」这个名词将会成为历史。'
    },
    {
      icon: 'model',
      title: '模型复用',
      description:
        '前端可以直接复用后端定义好的业务数据模型，让各端研发对业务模型有共同的理解，避免出现结构性的理解偏差，同时也避免低价值的重复劳动。'
    }
  ],

  MENU_HOME: '首页',
  MENU_INTRODUCTION: '介绍',
  COPIED: '已复制',
  HUOLALA_TECH: '货拉拉科技',
  RELEASED_UNDER_THE_LICENSE: '基于 $1 开源协议发布'
});
