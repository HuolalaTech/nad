import { u2a } from 'u2x';
import { notEmpty } from '../../utils';
import { AnnotationBase } from './AnnotationBase';

export class RequestMappingConditionExpression {
  public readonly key;
  public readonly value;
  public readonly negative;

  constructor(key: string, value: string, negative: boolean) {
    this.key = key;
    this.value = value;
    this.negative = negative;
  }

  static create(raw: unknown) {
    if (typeof raw !== 'string') return null;
    const m = raw.match(/^(.*?)(!?)=(.*)/);
    if (!m) return null;
    const [, key, negative, value] = m;
    return new RequestMappingConditionExpression(key, value, !!negative);
  }
}

/**
 * Spring Web annotations package name.
 */

const SPA = 'org.springframework.web.bind.annotation';

/**
 * @see https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/RequestMapping.html
 */
export class RequestMapping extends AnnotationBase<string> {
  public static iface = `${SPA}.RequestMapping`;

  public static alias = (['GetMapping', 'PostMapping', 'PutMapping', 'DeleteMapping', 'PatchMapping'] as const)
    .map((name) => {
      class MethodMapping extends RequestMapping {
        public static iface = `${SPA}.${name}`;
      }
      return MethodMapping as typeof RequestMapping;
    })
    .concat([RequestMapping]);

  get headers() {
    return u2a(this.raw.headers, RequestMappingConditionExpression.create).filter(notEmpty);
  }
  get params() {
    return u2a(this.raw.params, RequestMappingConditionExpression.create).filter(notEmpty);
  }
}
