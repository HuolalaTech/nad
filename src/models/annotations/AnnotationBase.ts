import { Annotations } from '.';

export class AnnotationBase<V> {
  protected raw;
  constructor(raw: Record<string, unknown>) {
    this.raw = Object(raw);
  }

  public get value() {
    return this.raw.value as V;
  }

  public static create<T extends typeof AnnotationBase<V>, V>(
    this: T,
    annotation: Annotations,
    name: string,
  ): InstanceType<T> | null;
  public static create<T extends typeof AnnotationBase<V>, V>(
    this: T,
    raw: Record<string, unknown> | null,
  ): InstanceType<T> | null;
  public static create<T extends typeof AnnotationBase<V>, V>(
    this: T,
    ...args: [Annotations, string] | [Record<string, unknown> | null]
  ): InstanceType<T> | null {
    if (args.length === 1) {
      const [raw] = args;
      if (raw == null) return null;
      return new this(raw) as InstanceType<T>;
    }
    if (args.length === 2) {
      const [annotation, name] = args;
      return this.create(annotation.find(name));
    }
    throw new Error('never');
  }
}
