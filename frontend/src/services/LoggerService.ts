export class LoggerService {
  static log(message: string, context?: Record<string, unknown>): void {
    console.log(message, context ?? '');
  }

  static warn(message: string, context?: Record<string, unknown>): void {
    console.warn(message, context ?? '');
  }

  static error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>,
  ): void {
    console.error(message, error, context ?? '');
  }
}
