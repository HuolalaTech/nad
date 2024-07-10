declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchCode(answer: string): R;
    }
  }
}

export {};
