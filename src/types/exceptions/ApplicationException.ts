export class ApplicationException extends Error {
  constructor(
    readonly message: string,
    readonly cause?: Error | unknown
  ) {
    super(message);
  }
}
