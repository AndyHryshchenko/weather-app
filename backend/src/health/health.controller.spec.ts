import { describe, expect, it } from 'vitest';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns ok status with timestamp', () => {
    const controller = new HealthController();
    const result = controller.health();
    expect(result.status).toBe('ok');
    expect(result.timestamp).toBeTruthy();
  });
});
