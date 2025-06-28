'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Importación dinámica del mapa
const MapaDispositivosPage = dynamic(
  () => import('./MapaDispositivosPage.jsx'),
  { ssr: false }
);

export default function GeolocatorMenu() {
  const [dispositivos, setDispositivos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('${process.env.NEXT_PUBLIC_API_URL}/api/dispositivos/all') // nuevo endpoint
      .then((res) => {
        setDispositivos(res.data || []);
      })
      .catch((err) => {
        console.error('Error al obtener dispositivos:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full h-[85vh] flex justify-center items-center overflow-x-hidden px-2">
      <div className="w-[95vw] max-w-[98vw] h-[85vh] bg-white rounded-lg shadow-xl p-6 border border-gray-200 flex flex-col">
        {/* Título dentro del fondo blanco */}
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Geolocalización
        </h1>

        {/* Mapa */}
        <div className="flex-grow">
          {loading ? (
            <p className="text-center text-gray-500">
              Cargando dispositivos...
            </p>
          ) : dispositivos.length === 0 ? (
            <p className="text-center text-gray-500">
              No se encontraron dispositivos con coordenadas.
            </p>
          ) : (
            <MapaDispositivosPage dispositivos={dispositivos} />
          )}
        </div>
      </div>
    </div>
  );
}
