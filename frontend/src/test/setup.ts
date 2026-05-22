import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import '../i18n/index.ts';

class ResizeObserverMock {
  private readonly callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(): void {
    this.callback([], this as unknown as ResizeObserver);
  }

  unobserve(): void {}

  disconnect(): void {}
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

Object.defineProperty(HTMLDivElement.prototype, 'offsetWidth', {
  configurable: true,
  get: () => 320,
});

Element.prototype.scrollIntoView = () => {};
