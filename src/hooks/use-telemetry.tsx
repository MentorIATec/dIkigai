"use client";

import { createContext, useContext, useMemo } from 'react';

type TelemetryEvent = Record<string, unknown>;

type Telemetry = {
  track: (event: string, props?: TelemetryEvent) => void;
};

const noop = () => {};

const TelemetryContext = createContext<Telemetry>({
  track: noop,
});

function consoleTelemetry(): Telemetry {
  return {
    track: (event, props) => {
      if (process.env.NODE_ENV !== 'production') {
        console.info(`[telemetry] ${event}`, props ?? {});
      }
    },
  };
}

export function createMockTelemetry(storeKey = '__telemetryEvents__'): Telemetry {
  return {
    track: (event, props) => {
      if (typeof window === 'undefined') {
        return;
      }
      const existing = (window as unknown as Record<string, TelemetryEvent[]>)[storeKey] ?? [];
      existing.push({ event, timestamp: new Date().toISOString(), ...(props ?? {}) });
      (window as unknown as Record<string, TelemetryEvent[]>)[storeKey] = existing;
      if (process.env.NODE_ENV !== 'production') {
        console.info(`[telemetry:preview] ${event}`, props ?? {});
      }
    },
  };
}

export function TelemetryProvider({
  value,
  children,
}: {
  value?: Telemetry;
  children: React.ReactNode;
}): JSX.Element {
  const telemetry = useMemo(() => value ?? consoleTelemetry(), [value]);
  return <TelemetryContext.Provider value={telemetry}>{children}</TelemetryContext.Provider>;
}

export function useTelemetry(): Telemetry {
  return useContext(TelemetryContext);
}
