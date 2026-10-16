'use client';

// App de la tablet física (para abrir en modo kiosko, ej. con "Fully Kiosk
// Browser" en una tablet Android apuntando a
// https://<tu-dominio>/tablet/<CodigoDumont>).
//
// Cada tantos segundos reporta que sigue conectada (y su GPS, si el
// navegador lo permite) y recibe de vuelta qué contenido tiene que mostrar
// y si está en horario de publicitar o tiene que quedar en modo reposo.

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { TABLET } from '@/lib/slices/constants';

const INTERVALO_SYNC_MS = 30000; // cada 30s avisa que sigue viva
const INTERVALO_GPS_MS = 2 * 60 * 1000; // cada 2 min intenta actualizar el GPS

export default function TabletPage() {
  const { codigoDumont } = useParams();

  const [config, setConfig] = useState(null);
  const [errorNotFound, setErrorNotFound] = useState(false);
  const [indiceActual, setIndiceActual] = useState(0);
  const [conectado, setConectado] = useState(true);
  const ultimaPosicion = useRef({ lat: null, lng: null });
  const videoRef = useRef(null);

  const sync = useCallback(async () => {
    try {
      const body = {};
      if (ultimaPosicion.current.lat != null) {
        body.latitud = ultimaPosicion.current.lat;
        body.longitud = ultimaPosicion.current.lng;
      }

      const res = await axios.post(`${TABLET}/${codigoDumont}/sync`, body);
      setConfig(res.data);
      setErrorNotFound(false);
      setConectado(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setErrorNotFound(true);
        setConfig(err.response.data);
      } else {
        // Sin conexión / error de red: seguimos mostrando lo último que
        // teníamos cargado, solo marcamos el estado como desconectado.
        setConectado(false);
      }
    }
  }, [codigoDumont]);

  // Sync inicial + polling periódico
  useEffect(() => {
    sync();
    const interval = setInterval(sync, INTERVALO_SYNC_MS);
    return () => clearInterval(interval);
  }, [sync]);

  // GPS periódico (si la tablet/navegador lo permite)
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;

    const actualizarPosicion = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          ultimaPosicion.current = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
        },
        () => {
          // Sin permiso de GPS: no pasa nada, se sigue usando la última
          // ubicación conocida (o la de respaldo del cliente).
        },
        { enableHighAccuracy: false, timeout: 10000 }
      );
    };

    actualizarPosicion();
    const interval = setInterval(actualizarPosicion, INTERVALO_GPS_MS);
    return () => clearInterval(interval);
  }, []);

  const playlist = config?.playlist || [];
  const itemActual = playlist[indiceActual % playlist.length];

  const avanzar = useCallback(() => {
    setIndiceActual((prev) => (playlist.length ? (prev + 1) % playlist.length : 0));
  }, [playlist.length]);

  // Si el contenido es una imagen, la mostramos por su duración configurada
  // y avanzamos solos. Si es un video, avanza el propio <video onEnded>.
  useEffect(() => {
    if (!itemActual || itemActual.tipo !== 'imagen') return;
    const timeout = setTimeout(avanzar, (itemActual.duracionSegundos || 8) * 1000);
    return () => clearTimeout(timeout);
  }, [itemActual, avanzar]);

  // Si la playlist cambia (nuevo contenido asignado) y el índice quedó
  // fuera de rango, lo reseteamos.
  useEffect(() => {
    if (indiceActual >= playlist.length) setIndiceActual(0);
  }, [playlist.length, indiceActual]);

  // ---------- Pantallas de error ----------

  if (errorNotFound) {
    const soporte = config?.soporte || {};
    return (
      <PantallaBase>
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
          <h1 className="text-3xl font-bold">Dispositivo no reconocido</h1>
          <p className="text-gray-400">
            El código <strong>{codigoDumont}</strong> no está registrado en
            DuMont. Contactá a soporte para configurarlo.
          </p>
          <ContactoSoporte soporte={soporte} />
        </div>
      </PantallaBase>
    );
  }

  if (!config) {
    return (
      <PantallaBase>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Conectando con DuMont...</p>
        </div>
      </PantallaBase>
    );
  }

  // ---------- Modo reposo (fuera de horario comercial) ----------

  if (!config.enHorario) {
    return (
      <PantallaBase>
        <ModoReposo cliente={config.cliente} conectado={conectado} soporte={config.soporte} />
      </PantallaBase>
    );
  }

  // ---------- Sin contenido asignado todavía ----------

  if (playlist.length === 0) {
    return (
      <PantallaBase>
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <h1 className="text-4xl font-bold tracking-wide">DuMont</h1>
          <p className="text-gray-400">Sin contenido asignado por ahora.</p>
          <EstadoConexion conectado={conectado} />
        </div>
      </PantallaBase>
    );
  }

  // ---------- Reproduciendo publicidad ----------

  return (
    <PantallaBase>
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        {itemActual?.tipo === 'imagen' ? (
          <img
            key={itemActual.idMultimedia}
            src={itemActual.url}
            alt=""
            className="w-full h-full object-contain"
          />
        ) : (
          <video
            key={itemActual?.idMultimedia}
            ref={videoRef}
            src={itemActual?.url}
            autoPlay
            muted
            playsInline
            onEnded={avanzar}
            className="w-full h-full object-contain"
          />
        )}

        <div className="absolute bottom-2 right-3 flex items-center gap-2">
          <EstadoConexion conectado={conectado} compact />
        </div>
      </div>
    </PantallaBase>
  );
}

function PantallaBase({ children }) {
  return <div className="w-screen h-screen bg-black">{children}</div>;
}

function EstadoConexion({ conectado, compact }) {
  return (
    <div
      className={`flex items-center gap-1 text-xs ${
        compact ? 'bg-black/50 px-2 py-1 rounded' : ''
      }`}
    >
      <span
        className={`inline-block w-2 h-2 rounded-full ${
          conectado ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <span className="text-gray-300">
        {conectado ? 'Conectado' : 'Sin conexión'}
      </span>
    </div>
  );
}

function ContactoSoporte({ soporte }) {
  if (!soporte?.telefono && !soporte?.whatsapp && !soporte?.email) return null;

  return (
    <div className="flex gap-4 mt-2 text-sm text-gray-300">
      {soporte.whatsapp && (
        <a
          href={`https://wa.me/${soporte.whatsapp}`}
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      )}
      {soporte.telefono && (
        <a href={`tel:${soporte.telefono}`} className="underline">
          Llamar
        </a>
      )}
      {soporte.email && (
        <a href={`mailto:${soporte.email}`} className="underline">
          Email
        </a>
      )}
    </div>
  );
}

function ModoReposo({ cliente, conectado, soporte }) {
  const [hora, setHora] = useState('');

  useEffect(() => {
    const actualizar = () =>
      setHora(
        new Date().toLocaleTimeString('es-AR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    actualizar();
    const interval = setInterval(actualizar, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 bg-black">
      <h1 className="text-2xl font-semibold tracking-widest text-gray-500">
        DuMont
      </h1>
      <p className="text-6xl font-light text-gray-300">{hora}</p>
      <p className="text-sm text-gray-600">
        Fuera de horario comercial
        {cliente?.horarioVenta ? ` (${cliente.horarioVenta})` : ''}
      </p>
      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
        <EstadoConexion conectado={conectado} compact />
        <ContactoSoporte soporte={soporte} />
      </div>
    </div>
  );
}
