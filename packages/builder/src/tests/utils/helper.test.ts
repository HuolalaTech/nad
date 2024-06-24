import { Root, Type } from '../..';
import { ocHelper, tsHelper } from '../../helpers';

const root = new Root({});

test.each([
  ['', 'unknown', 'NSObject'],
  ['java.lang.Object', 'unknown', 'NSObject'],
  ['MyUnknownClass', 'unknown', 'NSObject'],
  ['java.lang.String', 'string', 'NSString'],
  ['java.lang.Long', 'Long', 'NSNumber'],
  ['long', 'Long', 'NSNumber'],
  ['int', 'number', 'NSNumber'],
  ['java.lang.Integer', 'number', 'NSNumber'],
  ['java.lang.Boolean', 'boolean', 'NSNumber'],
  ['boolean', 'boolean', 'NSNumber'],
  ['java.util.List<java.lang.String>', 'string[]', 'NSArray<NSString*>'],
])('Convert %p to %p in ts and %p in oc', (raw, ts, oc) => {
  const type = Type.create(raw, root);
  expect(tsHelper.t2s(type)).toBe(ts);
  expect(ocHelper.t2s(type)).toBe(oc);
});
