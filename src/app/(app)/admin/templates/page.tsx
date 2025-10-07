import { Suspense } from 'react';
import TemplatesClient from './TemplatesClient';

export const dynamic = 'force-dynamic';

export default function AdminTemplatesPage(): JSX.Element {
  return (
    <Suspense fallback={<div className="p-4 text-sm">Cargando…</div>}>
      <TemplatesClient />
    </Suspense>
  );
}
