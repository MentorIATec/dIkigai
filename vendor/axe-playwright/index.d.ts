export interface AxeOptions {
  page?: import('@playwright/test').Page;
}

export class AxeBuilder {
  constructor(options?: AxeOptions);
  include(selector: string): this;
  exclude(selector: string): this;
  analyze(): Promise<{ violations: Array<unknown> }>;
}
