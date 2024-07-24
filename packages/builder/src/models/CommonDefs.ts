export class CommonDefs {
  private readonly defs;
  constructor() {
    this.defs = new Map<string, string>();
  }

  public readonly Nullable = (type: string) => {
    this.defs.set('Nullable<T>', 'T | null | undefined');
    return `Nullable<${type}>`;
  };

  public readonly BigDecimal = () => {
    this.defs.set('BigDecimal', '`${number}` | number');
    return 'BigDecimal';
  };

  public readonly BigInteger = () => {
    this.defs.set('BigInteger', '`${number}` | number');
    return 'BigInteger';
  };

  public readonly MultipartFile = () => {
    this.defs.set('MultipartFile', 'Blob | File | string');
    return 'MultipartFile';
  };

  public readonly Long = () => {
    this.defs.set('Long', '`${number}` | number');
    return 'Long';
  };

  [Symbol.iterator]() {
    return this.defs[Symbol.iterator]();
  }
}
