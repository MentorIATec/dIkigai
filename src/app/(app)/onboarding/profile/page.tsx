import { Suspense } from 'react';
import { ProfileOnboardingClient } from './ProfileOnboardingClient';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Cargando perfil…</div>}>
      <ProfileOnboardingClient />
    </Suspense>
  );
}
