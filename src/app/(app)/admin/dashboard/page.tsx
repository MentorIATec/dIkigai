import { Suspense } from "react";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm">Cargando…</div>}>
      <DashboardClient />
    </Suspense>
  );
}
