// app/admin/clientMenu/Pages/EditClient/page.jsx
import { Suspense } from 'react';
import CustomerEdition from './CustomerEdition';

export default function Page() {
  return (
    <Suspense
      fallback={<div className="text-white p-4">Cargando cliente...</div>}
    >
      <CustomerEdition />
    </Suspense>
  );
}
