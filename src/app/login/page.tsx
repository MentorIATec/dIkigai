import { Suspense } from 'react';
import { AUTH_PROVIDER } from '@/lib/auth/config';
import LoginClient from './LoginClient';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center p-6 text-sm">Cargando…</div>}>
      <LoginClient authProvider={AUTH_PROVIDER} />
    </Suspense>
  );
}
