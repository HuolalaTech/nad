export class MediaType {
  private readonly raw;
  public readonly type;
  public readonly subtype;

  constructor(raw: string, type: string, subtype: string) {
    this.raw = raw;
    this.type = type.toLowerCase();
    this.subtype = subtype.toLowerCase();
  }

  public toString() {
    return this.raw;
  }

  public static create(raw: unknown) {
    if (typeof raw !== 'string') return null;
    // https://httpwg.org/specs/rfc9110.html#media.type
    const m = raw.match(/^(.*?)\/(.*?)(\s*;|$)/);
    if (!m) return null;
    const [, type, subtype] = m;
    return new MediaType(raw, type, subtype);
  }
}
