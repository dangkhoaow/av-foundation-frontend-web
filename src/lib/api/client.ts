/**
 * API Client Configuration
 * Centralized API client using fetch with interceptors
 */

import { env } from '@/config/env';

export interface ApiError {
  message: string;
  status: number;
  data?: any;
}

interface ApiRequestConfig {
  maxAttempts?: number;
  timeoutMs?: number;
}

const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);
const MAX_RETRY_ATTEMPTS = 2;
const BASE_RETRY_DELAY_MS = 1000;

const sleep = (delayMs: number) => new Promise<void>((resolve) => setTimeout(resolve, delayMs));

export class ApiClient {
  private baseURL: string;
  private timeout: number;
  private headers: Record<string, string>;

  constructor(baseURL: string = env.apiUrl, timeout: number = env.apiTimeout, locale?: string) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.headers = {};
    
    // Set locale header if provided
    if (locale) {
      this.setLocale(locale);
    }
  }

  private getRetryDelayMs(retryAfterHeader: string | null, attempt: number): number {
    if (retryAfterHeader) {
      const retryAfterSeconds = Number(retryAfterHeader);
      if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
        return retryAfterSeconds * 1000;
      }

      const retryAfterDate = Date.parse(retryAfterHeader);
      if (Number.isFinite(retryAfterDate)) {
        return Math.max(retryAfterDate - Date.now(), BASE_RETRY_DELAY_MS * (attempt + 1));
      }
    }

    return BASE_RETRY_DELAY_MS * 2 ** attempt;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    config: ApiRequestConfig = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const method = (options.method || 'GET').toUpperCase();
    const canRetry = method === 'GET' || method === 'HEAD';
    const defaultMaxAttempts = canRetry ? MAX_RETRY_ATTEMPTS + 1 : 1;
    const maxAttempts = config.maxAttempts ?? defaultMaxAttempts;
    const requestTimeout = config.timeoutMs ?? this.timeout;
    
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), requestTimeout);

      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...this.headers,
            ...options.headers,
          },
          signal: controller.signal,
        });

        if (response.ok) {
          const data = await response.json();
          clearTimeout(timeoutId);
          return data as T;
        }

        if (canRetry && RETRYABLE_STATUS_CODES.has(response.status) && attempt < maxAttempts - 1) {
          const retryDelayMs = this.getRetryDelayMs(response.headers.get('Retry-After'), attempt);
          console.warn('[ApiClient] Retrying request after HTTP error', {
            url,
            method,
            status: response.status,
            attempt: attempt + 1,
            retryDelayMs,
          });
          clearTimeout(timeoutId);
          await sleep(retryDelayMs);
          continue;
        }

        const error: ApiError = {
          message: response.statusText,
          status: response.status,
        };

        try {
          error.data = await response.json();
        } catch (parseError) {
          // Response body is not JSON.
        }

        clearTimeout(timeoutId);
        throw error;
      } catch (error: any) {
        clearTimeout(timeoutId);

        if (error?.name === 'AbortError') {
          if (canRetry && attempt < maxAttempts - 1) {
            const retryDelayMs = this.getRetryDelayMs(null, attempt);
            console.warn('[ApiClient] Retrying request after timeout', {
              url,
              method,
              status: 408,
              attempt: attempt + 1,
              retryDelayMs,
            });
            await sleep(retryDelayMs);
            continue;
          }

          throw {
            message: 'Request timeout',
            status: 408,
          } as ApiError;
        }

        if (error?.status) {
          if (canRetry && RETRYABLE_STATUS_CODES.has(error.status) && attempt < maxAttempts - 1) {
            const retryDelayMs = this.getRetryDelayMs(null, attempt);
            console.warn('[ApiClient] Retrying request after API error', {
              url,
              method,
              status: error.status,
              attempt: attempt + 1,
              retryDelayMs,
            });
            await sleep(retryDelayMs);
            continue;
          }

          throw error as ApiError;
        }

        if (canRetry && attempt < maxAttempts - 1) {
          const retryDelayMs = this.getRetryDelayMs(null, attempt);
          console.warn('[ApiClient] Retrying request after network error', {
            url,
            method,
            status: 0,
            attempt: attempt + 1,
            retryDelayMs,
          });
          await sleep(retryDelayMs);
          continue;
        }

        throw {
          message: error?.message || 'Network error',
          status: 0,
        } as ApiError;
      }
    }

    throw {
      message: 'Request failed',
      status: 0,
    } as ApiError;
  }

  async get<T>(endpoint: string, options?: RequestInit, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' }, config);
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      body: JSON.stringify(data),
    }, config);
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      body: JSON.stringify(data),
    }, config);
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      body: JSON.stringify(data),
    }, config);
  }

  async delete<T>(endpoint: string, options?: RequestInit, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' }, config);
  }

  setHeader(key: string, value: string) {
    this.headers[key] = value;
  }

  removeHeader(key: string) {
    delete this.headers[key];
  }

  setLocale(locale: string) {
    this.headers['Accept-Language'] = locale;
  }
}

// Create default API client instance
export const apiClient = new ApiClient();

export default apiClient;

