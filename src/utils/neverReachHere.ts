import { NeverReachHere } from '../exceptions';

export function neverReachHere(): Error;
export function neverReachHere(u: never): Error;
export function neverReachHere(u: never, message: string): Error;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function neverReachHere(u?: never, message?: string) {
  return new NeverReachHere(message);
}
