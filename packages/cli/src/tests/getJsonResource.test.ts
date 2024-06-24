import { getJsonResource } from '../processByConfig';
import { Readable } from 'stream';

describe('getJsonResource', () => {
  test('form disk', async () => {
    const res = await getJsonResource(__dirname + '/json/minimal.json');
    expect(res).toBeDefined();
  });

  test('form stdin', async () => {
    // Mock stdin
    const stdin = new Readable();
    stdin.push('{"a":1}');
    stdin.push(null);
    Object.defineProperty(process, 'stdin', { value: stdin, enumerable: true, configurable: true });

    const res = await getJsonResource('-');
    expect(res).toMatchObject({ a: 1 });
  });

  test('bad json', async () => {
    try {
      await getJsonResource(__filename);
    } catch (e) {
      expect(e).toBeInstanceOf(SyntaxError);
    }
  });
});
