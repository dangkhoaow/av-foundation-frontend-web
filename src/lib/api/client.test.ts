import { describe, it, expect, vi, afterEach } from 'vitest';
import { ApiClient } from './client';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.useRealTimers();
});

describe('ApiClient', () => {
  it('adds locale header when provided', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    globalThis.fetch = fetchSpy;

    const client = new ApiClient('https://example.com', 5000, 'vi');
    await client.get('/api/test');

    const [, options] = fetchSpy.mock.calls[0];
    expect(options.headers['Accept-Language']).toBe('vi');
  });

  it('builds a full request URL', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    globalThis.fetch = fetchSpy;

    const client = new ApiClient('https://example.com', 5000);
    await client.get('/api/test');

    expect(fetchSpy.mock.calls[0][0]).toBe('https://example.com/api/test');
  });

  it('retries once after a retryable response', async () => {
    vi.useFakeTimers();

    const fetchSpy = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        headers: {
          get: () => null,
        },
        json: async () => ({ message: 'rate limited' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });
    globalThis.fetch = fetchSpy;

    const client = new ApiClient('https://example.com', 5000);
    const requestPromise = client.get('/api/test');

    await vi.runAllTimersAsync();

    await expect(requestPromise).resolves.toEqual({ ok: true });
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});
