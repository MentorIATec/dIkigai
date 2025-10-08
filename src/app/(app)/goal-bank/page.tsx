import { Suspense } from 'react';

import GeneradorMetas from '@/app/(app)/goal-bank/ui/GeneradorMetas';

export const dynamic = 'force-dynamic';

export default function GoalBankPage(): JSX.Element {
  const flag = process.env.NEXT_PUBLIC_GOAL_GEN_V2;
  const isEnabled =
    flag === undefined || flag === '1' || flag?.toLowerCase() === 'true' || flag?.toLowerCase() === 'enabled';

  if (!isEnabled) {
    return (
      <section className="space-y-4">
        <h1 className="text-3xl font-headline font-semibold tracking-tight">Generador de metas</h1>
        <p className="text-muted-foreground">
          El generador de metas estará disponible próximamente. Mientras tanto, puedes trabajar con tus metas actuales en
          MiVidaTec → Mi Plan de Vida.
        </p>
      </section>
    );
  }

  return (
    <Suspense fallback={<div className="p-4 text-sm">Cargando generador…</div>}>
      <GeneradorMetas />
    </Suspense>
  );
}
