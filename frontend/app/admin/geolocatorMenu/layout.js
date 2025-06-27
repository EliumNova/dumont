'use client';

import dynamic from 'next/dynamic';

const MapaInteractivo = dynamic(() => import('./GeolocatorMenu.jsx'), {
  ssr: false,
});

export default function GeolocatorMenu({ dispositivos }) {
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Ubicaciones de Dispositivos</h1>
      <MapaInteractivo dispositivos={dispositivos} />
    </div>
  );
}
