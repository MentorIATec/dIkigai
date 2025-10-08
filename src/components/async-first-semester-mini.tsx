'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const FirstSemesterMini = dynamic(() => import('./first-semester-mini').then(mod => ({ default: mod.FirstSemesterMini })), {
  loading: () => (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  ),
  ssr: false
});

export { FirstSemesterMini };
