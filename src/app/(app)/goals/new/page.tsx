import { Suspense } from 'react';

import NewGoalClient from './NewGoalClient';

export const dynamic = 'force-dynamic';

export default function NewGoalPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm">Cargando…</div>}>
      <NewGoalClient />
    </Suspense>
  );
}
