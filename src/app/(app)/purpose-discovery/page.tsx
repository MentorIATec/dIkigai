import { Suspense } from 'react';
import { PurposeDiscoveryClient } from './PurposeDiscoveryClient';

export default function PurposeDiscoveryPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PurposeDiscoveryClient />
    </Suspense>
  );
}
