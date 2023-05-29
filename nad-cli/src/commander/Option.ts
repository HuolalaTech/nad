export class Option<T = unknown> {
  private $value?: T;
  private readonly read;
  constructor(read: (...a: string[]) => T) {
    this.read = read;
  }

  public get value() {
    return this.$value;
  }

  public feed(argv: readonly string[], index: number) {
    const { read } = this;
    const len = read.length;
    this.$value = read(...argv.slice(index, index + len));
    return index + len;
  }

  public reset() {
    delete this.$value;
  }
}
