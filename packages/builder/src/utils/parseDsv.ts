// parse dot separated values as a generator.
export function* parseDsv(input: string) {
  let position = input.length;
  do {
    const nextPosition = input.lastIndexOf('.', position - 1);
    yield input.slice(nextPosition + 1, position);
    position = nextPosition;
  } while (position > 0);
}
