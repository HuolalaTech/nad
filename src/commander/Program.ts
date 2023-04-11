import { UnknownOption } from '../errors';
import { Option } from './Option';

export class Program<T extends Record<string, Option>> {
  public readonly args: string[] = [];
  public readonly options;
  constructor(options: T) {
    this.options = options;
  }
  public build(argv: readonly string[]) {
    const { options, args } = this;
    for (let i = 2; i < argv.length; ) {
      const a = argv[i++];
      const o = /^--?(.*)/.exec(a);
      if (o) {
        const n = options[o[1]];
        if (!(n instanceof Option)) throw new UnknownOption(a);
        i = n.feed(argv, i);
      } else {
        args.push(a);
      }
    }
    return this;
  }
  public reset() {
    this.args.splice(0);
    Object.values(this.options).forEach((o) => o.reset());
  }
  public getOption<N extends keyof T>(name: N): T[N]['value'] {
    return this.options[name].value;
  }
}
