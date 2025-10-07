export interface StartOptions {
  onUnhandledRequest?: 'bypass' | 'warn' | 'error';
}

export interface Worker {
  start(options?: StartOptions): Promise<void>;
  handlers: unknown[];
}

export function setupWorker(...handlers: unknown[]): Worker;

export const HttpResponse: {
  json<T>(payload: T, init?: Record<string, unknown>): { payload: T; init?: Record<string, unknown> };
};

export const http: (...args: unknown[]) => unknown;
