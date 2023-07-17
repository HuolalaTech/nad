import { u2o } from 'u2x';
import { Annotations } from '.';

export class AnnotationBase<V> {
  protected raw;
  constructor(raw: Record<string, unknown>) {
    this.raw = u2o(raw);
  }

  public get value() {
    return this.raw.value as V;
  }

  public static iface: string;

  public static create<T extends typeof AnnotationBase<V>, V>(
    this: T,
    annotations: Annotations,
  ): InstanceType<T> | null {
    const raw = annotations.find(this.iface);
    if (!raw) return null;
    return new this(raw) as InstanceType<T>;
  }
}
