import { lang } from './utils';

const type = lang.replace(/-.*/g, '');

interface Desc {
  zh: string;
  en: string;
}

export const getTemplateByType = (desc: Desc, key: string = type) => {
  return key in desc ? desc[key as keyof typeof desc] : desc.en;
};

export const i18n = <T extends number>(desc: Desc) => {
  type Ins = number | string | null | undefined;
  type Args<P extends Ins[]> = P['length'] extends T ? P : Args<[...P, Ins]>;
  const fn = (...args: Args<[]>) => {
    const template = getTemplateByType(desc);
    return template.replace(/\$(\d+)(<(.*?),(.*?)>)?/g, (_, number, isChoice, singular, plural) => {
      const variable = String((args as Ins[])[number - 1]);
      if (isChoice) {
        // eslint-disable-next-line no-control-regex
        const number = variable.replace(/\x1b.*?m/g, '');
        return +number > 1 ? plural : singular;
      }
      return variable;
    });
  };
  return Object.assign(fn, desc);
};

export const I100 = i18n<0>({
  zh: `
用法: nad [选项] <URL>
      nad --config <Path>
      nad -c <Path>
      
例子: nad http://localhost:8080
      nad -t oc http://localhost:8080

选项:
  -t, --target <target>     输出的文件格式，支持 ts, oc, raw，默认是 ts
  -c, --confit <path>       指定一个配置文件（如果使用配置文件，其它将会被忽略）
  -h, --help                输出本帮助信息
  `,
  en: `
Usage: nad [Options] <URL>
       nad --config <Path>
       nad -c <Path>

Example: nad http://localhost:8080
         nad -t oc http://localhost:8080

Options:
  -t, --target <target>     Specify the output file format ("ts", "oc", "raw"), defaults to "ts".
  -c, --config <path>       Path to configuration file. If specified, all other arguments will be ignored.
  -h, --help                Display this help message.
  `,
});

export const I101 = i18n<1>({
  zh: `成功生成 $1 个模块，其中包含:`,
  en: `A total of $1 $1<module,modules> $1<was,were> generated, containing the following:`,
});

export const I102 = i18n<1>({
  zh: `$1 个方法`,
  en: `$1 $1<method,methods>`,
});

export const I103 = i18n<1>({
  zh: `$1 个类型定义`,
  en: `$1 interface $1<declaration,declarations>`,
});

export const I104 = i18n<1>({
  zh: `$1 个枚举定义`,
  en: `$1 enum $1<declaration,declarations>`,
});

export const I105 = i18n<1>({
  zh: `发现 $1 个未知类型:`,
  en: `$1 unknown $1<type,types> found:`,
});

export const I107 = i18n<1>({
  zh: `无效的命令选项 "$1"`,
  en: `Invalid option "$1"`,
});

export const I108 = i18n<0>({
  zh: `你指定了一个配置文件，因此其它参数将会被忽略`,
  en: `Since a configuration file was specified, all other arguments will be ignored`,
});

export const I109 = i18n<1>({
  zh: `配置文件中缺少 $1 字段`,
  en: `The configuration file is missing the '$1' field`,
});

export const I110 = i18n<1>({
  zh: `提供的 $1 不是一个有效的 URI`,
  en: `The '$1' is not a valid URI`,
});

export const I111 = i18n<1>({
  zh: `提供的 $1 是一个目录而不是文件`,
  en: `The '$1' is a directory, not a file`,
});

export const I112 = i18n<1>({
  zh: `无效的输出格式 '$1'，只支持 ts、oc、raw`,
  en: `The output format '$1' is not valid. Only 'ts', 'oc', and 'raw' are supported`,
});

export const I113 = i18n<1>({
  zh: `配置文件 $1 不是一个有效的 JSON`,
  en: `The configuration file '$1' is not a valid JSON`,
});

export const I114 = i18n<1>({
  zh: `配置文件 $1 不存在`,
  en: `The configuration file '$1' not found`,
});

export const I115 = i18n<3>({
  zh: `接口响应了一个 $1 内容类型，期望是 $2（来自 $3）`,
  en: `Response Content-Type $1 while expected $2 (from $3)`,
});
