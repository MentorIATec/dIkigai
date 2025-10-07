import { Suspense } from 'react';
import { AdminStudentsClient } from './AdminStudentsClient';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Cargando estudiantes…</div>}>
      <AdminStudentsClient />
    </Suspense>
  );
}
