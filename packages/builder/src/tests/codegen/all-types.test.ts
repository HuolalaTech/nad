import { Annotations } from 'src/models';
import { buildOcMethodWithParameters, buildTsMethodWithParameters } from '../test-tools/buildMethodWithParameters';
import { DeepPartial } from 'src/utils';
import { NadParameter } from 'src/types/nad';

const typeVector = describe.each([
  ['', 'unknown', 'NSObject*'],
  ['boolean', 'boolean', 'NSNumber*'],
  ['void', 'void', 'void*'],
  ['java.util.List', 'unknown[]', 'NSArray<NSObject*>*'],
  ['java.util.List<java.lang.Long>', 'Long[]', 'NSArray<NSNumber*>*'],
  ['java.util.List<java.lang.Void>', 'void[]', 'NSArray<void*>*'],
  ['java.util.Map<java.lang.Long, java.lang.Long>', 'Record<Long, Long>', 'NSDictionary*'],
  ['groovy.lang.Tuple2<java.lang.String, java.lang.Long>', '[ string, Long ]', 'NSArray<NSObject*>*'],
  ['java.util.List<java.lang.ThreadLocal<java.lang.Long>>', 'Optional<Long>[]', 'NSArray<NSNumber*>*' ],
  ['java.util.List<java.util.Optional<java.lang.Long>>', 'Optional<Long>[]', 'NSArray<NSNumber*>*' ],
  ['java.util.List<java.util.Optional>', 'unknown[]', 'NSArray<NSObject*>*' ]
]);

typeVector('Convert %p', (javaType, tsType, ocType) => {
  const type: DeepPartial<NadParameter> = {
    name: 'value',
    type: javaType,
    annotations: [{ type: 'org.springframework.web.bind.annotation.RequestParam', attributes: { required: true } }],
  };

  test('For oc', () => {
    const ocCode = buildOcMethodWithParameters(type).replace(/.*(- \(NSNumber\*\)foo:.*?value;).*/, '$1');;
    expect(ocCode).toContain(`- (NSNumber*)foo:(${ocType})value;`);
  });

  test('For ts', () => {
    const tsCode = buildTsMethodWithParameters(type).replace(/.*(async foo\(.*?,) settings\?:.*/, '$1');
    expect(tsCode).toContain(`async foo(value: ${tsType},`);
  });
});
