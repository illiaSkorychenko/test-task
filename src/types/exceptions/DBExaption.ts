import { ApplicationException } from './ApplicationException';

export class DbException extends ApplicationException {
  constructor(message: string, cause?: Error | unknown) {
    super(message, cause);
  }
}
