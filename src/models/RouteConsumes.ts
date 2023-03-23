import { APPLICATION_JSON, MULTIPART_FORM_DATA, WWW_FORM_URLENCODED } from '../constants';
import { Dubious, notEmpty, u2a } from '../utils';
import { MediaType } from './MediaType';

export class RouteConsumes {
  private readonly map;
  private readonly list;

  constructor(raw: Dubious<string[]>) {
    this.list = u2a(raw, MediaType.create).filter(notEmpty);
    this.map = new Map(this.list.map((i) => [i.toString(), i]));
  }

  public getTheBest() {
    const { list, map } = this;
    if (list.length === 0) return null;
    for (const type of RouteConsumes.priorityList) {
      const m = map.get(type);
      if (m) return m.toString();
    }
    return list[0].toString();
  }

  public static readonly priorityList = [MULTIPART_FORM_DATA, WWW_FORM_URLENCODED, APPLICATION_JSON];
}
