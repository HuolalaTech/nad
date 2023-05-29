import { red, bold } from './ansi';

export const errorHandler = (what: unknown) => {
  const error = what instanceof Error ? what : new Error(String(what));
  const message =
    error.stack?.replace(/.*/gm, (line: string) => {
      if (line[0] === ' ') return red(line);
      return red(bold(line));
    }) || error.message;
  process.stderr.write(message);
  process.stderr.write('\n\n');
};
