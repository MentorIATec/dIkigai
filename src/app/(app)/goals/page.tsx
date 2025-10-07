import { Suspense } from 'react';

import GoalsClient from './GoalsClient';

export const dynamic = 'force-dynamic';

export default function GoalsPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm">Cargando…</div>}>
      <GoalsClient />
    </Suspense>
  );
}
