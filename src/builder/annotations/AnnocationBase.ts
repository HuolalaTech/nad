export class AnnotationBase {
  protected raw;
  constructor(raw: Record<string, unknown>) {
    this.raw = Object(raw);
  }

  static create<T extends typeof AnnotationBase>(this: T, raw: Record<string, unknown> | null): InstanceType<T> | null {
    if (raw == null) return null;
    return new this(raw) as InstanceType<T>;
  }
}
