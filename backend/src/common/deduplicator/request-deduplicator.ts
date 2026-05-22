export class RequestDeduplicator<T> {
  private readonly pending = new Map<string, Promise<T>>();

  dedupe(key: string, factory: () => Promise<T>): Promise<T> {
    const existing = this.pending.get(key);
    if (existing) {
      return existing;
    }
    const promise = factory().finally(() => this.pending.delete(key));
    this.pending.set(key, promise);
    return promise;
  }
}
