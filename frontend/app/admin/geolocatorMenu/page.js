'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

// Importación dinámica del mapa
const MapaDispositivosPage = dynamic(
  () => import('./MapaDispositivosPage.jsx'),
  { ssr: false }
);

// Cada cuánto se vuelve a pedir la ubicación de los dispositivos.
const INTERVALO_REFRESCO_MS = 10000;

export default function GeolocatorMenu() {
  const [dispositivos, setDispositivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

  const cargar = useCallback(async () => {
    try {
      const res = await axios.get('/api/dispositivos/all');
      setDispositivos(res.data || []);
      setUltimaActualizacion(new Date());
      setError(false);
    } catch (err) {
      console.error('Error al obtener dispositivos:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial + refresco automático. Se pausa mientras la pestaña está
  // oculta (no tiene sentido gastar pedidos si nadie está mirando el mapa) y
  // se refresca de inmediato al volver.
  useEffect(() => {
    cargar();

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') cargar();
    }, INTERVALO_REFRESCO_MS);

    const alVolver = () => {
      if (document.visibilityState === 'visible') cargar();
    };
    document.addEventListener('visibilitychange', alVolver);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', alVolver);
    };
  }, [cargar]);

  return (
    <div className="w-full h-full min-h-[320px] overflow-hidden">
      <div className="w-full h-full bg-white p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Geolocalización</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${
                error ? 'bg-red-500' : 'bg-green-500 animate-pulse'
              }`}
            />
            {error
              ? 'Sin conexión con el servidor, reintentando…'
              : ultimaActualizacion
                ? `En vivo · actualizado ${ultimaActualizacion.toLocaleTimeString(
                    'es-AR'
                  )}`
                : 'Conectando…'}
          </div>
        </div>

        {/* Mapa */}
        <div className="flex-grow min-h-0">
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
