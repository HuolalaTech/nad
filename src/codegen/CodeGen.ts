import { u2o } from '../utils';

const isIterable = (what: unknown): what is Iterable<unknown> => {
  return !!what && typeof u2o(what)[Symbol.iterator] === 'function';
};

export class CodeGen {
  public indent = '';
  public lines: string[] = [];
  [Symbol.iterator]() {
    return this.lines[Symbol.iterator]();
  }
  write(...liens: unknown[]) {
    for (const i of liens) {
      if (typeof i === 'string') {
        let line = this.indent;
        // Comment block cannot be nested
        if (this.indent.indexOf('*') === -1) {
          line += i;
        } else {
          line += i.replace(/\*\//g, '');
        }
        this.lines.push(line);
      } else if (isIterable(i)) {
        this.write(...i);
      } else {
        throw new TypeError(`Faild to write type '${typeof i}'`);
      }
    }
  }
  amend(f: (s: string) => string) {
    const { lines } = this;
    const last = lines.length - 1;
    lines[last] = f(lines[last]);
  }
  writeComment(what: unknown) {
    if (typeof what === 'string') {
      this.write(`// ${what}`);
    } else if (typeof what === 'function') {
      this.write('/**');
      this.indent += ' * ';
      what();
      this.indent = this.indent.replace(/ \* $/, '');
      this.write(' */');
    } else {
      throw new TypeError('faild to writeComment');
    }
  }
  writeBlock(callback: () => void) {
    this.indent += '  ';
    callback();
    this.indent = this.indent.replace(/ {2}$/, '');
  }
  toString() {
    return this.lines.join('\n');
  }
}
