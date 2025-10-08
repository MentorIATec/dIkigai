export type Meta<T> = {
  title: string;
  component?: unknown;
  parameters?: Record<string, unknown>;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
  render?: (args: T) => unknown;
};

export type StoryObj<T> = {
  args?: Partial<T>;
  render?: (args: T) => unknown;
  parameters?: Record<string, unknown>;
};
