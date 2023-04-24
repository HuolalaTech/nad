import { neverReachHere } from '.';

export class SyntaxReader {
  private index = 0;
  private readonly input;
  constructor(input: string) {
    this.input = input;
  }
  read(pattern: string | RegExp) {
    const { input } = this;
    if (typeof pattern === 'string') {
      for (let i = 0; i < pattern.length; i++) {
        if (input[this.index + i] !== pattern[i]) return '';
      }
      this.index += pattern.length;
      return pattern;
    }
    if (pattern instanceof RegExp) {
      if (!pattern.global) throw new TypeError('The global flag must be set');
      pattern.lastIndex = this.index;
      const m = pattern.exec(input);
      if (!m) return '';
      if (m.index !== this.index) return '';
      this.index += m[0].length;
      return m[0];
    }
    throw neverReachHere(pattern);
  }
}
