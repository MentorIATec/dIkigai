let started = false;

declare global {
  interface Window {
    __mswEnabled?: boolean;
  }
}

export async function setupMocksIfNeeded(): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get('preview') !== '1') {
    return;
  }

  if (started || window.__mswEnabled) {
    return;
  }

  const { worker } = await import('@/mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
  window.__mswEnabled = true;
  started = true;
}
