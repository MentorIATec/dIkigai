export interface LaunchOptions {
  headless?: boolean;
}

export interface Locator {
  click(): Promise<void>;
  fill(value: string): Promise<void>;
  press(key: string): Promise<void>;
}

export interface Page {
  goto(url: string, options?: Record<string, unknown>): Promise<void>;
  locator(selector: string): Locator;
  evaluate<T>(callback: (arg: T) => unknown, arg?: T): Promise<unknown>;
  screenshot(options: { path: string; fullPage?: boolean }): Promise<void>;
  waitForTimeout(ms: number): Promise<void>;
  close(): Promise<void>;
}

export interface Browser {
  newPage(): Promise<Page>;
  close(): Promise<void>;
}

export interface BrowserType {
  launch(options?: LaunchOptions): Promise<Browser>;
}

export const chromium: BrowserType;
export const firefox: BrowserType;
export const webkit: BrowserType;
