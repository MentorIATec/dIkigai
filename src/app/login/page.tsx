import { Suspense } from 'react';
import { AUTH_PROVIDER } from '@/lib/auth/config';
import LoginClient from './LoginClient';

export const dynamic = 'force-dynamic';

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const nextParam = resolvedSearchParams?.next;
  const next = Array.isArray(nextParam) ? nextParam[0] : nextParam;
  const safeNext = typeof next === 'string' && next.length > 0 ? next : '/dashboard';

  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center p-6 text-sm">Cargando…</div>}>
      <LoginClient authProvider={AUTH_PROVIDER} next={safeNext} />
    </Suspense>
  );
}
