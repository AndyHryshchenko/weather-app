import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppLoggerService {
  private readonly logger = new Logger('WeatherApp');

  log(message: string, context?: Record<string, unknown>): void {
    this.logger.log(this.formatMessage(message, context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.logger.warn(this.formatMessage(message, context));
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.logger.error(this.formatMessage(message, context));
  }

  logCacheAccess(result: 'hit' | 'miss', cacheKey: string): void {
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    const label = result === 'hit' ? 'HIT' : 'MISS';
    this.log(`[CACHE ${label}]`, { cacheKey });
  }

  private formatMessage(
    message: string,
    context?: Record<string, unknown>,
  ): string {
    if (!context || Object.keys(context).length === 0) {
      return message;
    }
    return `${message} ${JSON.stringify(context)}`;
  }
}
