import type { Browser, Page } from 'playwright';

export interface TestInfo {
  outputPath(fileName: string): string;
  attach(name: string, options: { path: string; contentType: string }): void;
}

export interface TestCallbackArgs {
  page: Page;
}

export type TestCallback = (args: TestCallbackArgs, info: TestInfo) => Promise<void> | void;

export interface TestFn {
  (name: string, callback: TestCallback): Promise<void>;
  describe: (...args: unknown[]) => void;
  skip: (...args: unknown[]) => void;
  only: (...args: unknown[]) => void;
}

export const test: TestFn;

export interface Expectation {
  toEqual(expected: unknown): void;
  toBe(expected: unknown): void;
  toBeTruthy(): void;
}

export function expect(value: unknown): Expectation;

export const chromium: Browser;
export const firefox: Browser;
export const webkit: Browser;

export type PlaywrightTestConfig = Record<string, unknown>;

export function defineConfig<T extends PlaywrightTestConfig>(config: T): T;

export const devices: Record<string, unknown>;

export type { Page } from 'playwright';
