import { NeverReachHere } from '../exceptions';
import { AnnotationBase } from '../models/annotations/AnnotationBase';

test('AnnotationBase.create', () => {
  expect(() => {
    (AnnotationBase.create as () => void)();
  }).toThrowError(NeverReachHere);
});
