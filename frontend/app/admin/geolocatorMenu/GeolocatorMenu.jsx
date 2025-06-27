'use client';

import dynamic from 'next/dynamic';

const MapaDispositivos = dynamic(() => import('./MapaDispositivosPage.jsx'), {
  ssr: false,
});

export default function GeolocatorMenu({ dispositivos }) {
  return (
    <div className="flex flex-col items-center p-4 w-full h-screen">
      <h1 className="text-2xl font-bold mb-4">Ubicaciones de Dispositivos</h1>
      <div className="w-full h-full">
        <MapaDispositivos dispositivos={dispositivos} />
      </div>
    </div>
  );
}
