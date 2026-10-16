'use client';

// App de la tablet física (para abrir en modo kiosko, ej. con "Fully Kiosk
// Browser" en una tablet Android apuntando a
// https://<tu-dominio>/tablet/<CodigoDumont>).
//
// Cada tantos segundos reporta que sigue conectada (y su GPS, si el
// navegador lo permite) y recibe de vuelta qué contenido tiene que mostrar
// y si está en horario de publicitar o tiene que quedar en modo reposo.
//
// Pensada para correr 24/7:
//  - Guarda los videos/imágenes de la playlist en el propio equipo (Cache
//    Storage) para que sigan reproduciéndose si se corta internet. Requiere
//    HTTPS (o localhost); sin eso reproduce directo desde la red.
//  - Mantiene la pantalla prendida (Wake Lock).
//  - Si un archivo falla al cargar, salta al siguiente en vez de quedarse
//    colgada.

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { TABLET } from '@/lib/slices/constants';

const INTERVALO_SYNC_MS = 15000; // cada 15s avisa que sigue viva
const NOMBRE_CACHE = 'dumont-media-v1';

// ---------- Cache de archivos multimedia ----------

const cacheDisponible = () =>
  typeof window !== 'undefined' && 'caches' in window;

// Devuelve una URL local (blob:) del archivo, bajándolo y guardándolo en el
// cache la primera vez. Si algo falla, lanza el error y el llamador sigue
// usando la URL de red.
async function obtenerUrlLocal(url) {
  const cache = await caches.open(NOMBRE_CACHE);
  let respuesta = await cache.match(url);

  if (!respuesta) {
    const descarga = await fetch(url, { mode: 'cors' });
    if (!descarga.ok) throw new Error(`HTTP ${descarga.status}`);
    await cache.put(url, descarga.clone());
    respuesta = descarga;
  }

  const blob = await respuesta.blob();
  return URL.createObjectURL(blob);
}

// Borra del cache los archivos que ya no están en la playlist.
async function limpiarCache(urlsVigentes) {
  const cache = await caches.open(NOMBRE_CACHE);
  const claves = await cache.keys();
  await Promise.all(
    claves
      .filter((req) => !urlsVigentes.has(req.url))
      .map((req) => cache.delete(req))
  );
}

// Identificador propio de este navegador para el link de "un solo dispositivo".
// Se guarda en localStorage: sobrevive a recargas y reinicios, así la misma
// tablet siempre recupera su pantalla. Otro navegador genera uno distinto y
// el servidor lo rechaza mientras la primera siga conectada.
function obtenerIdSesion(codigo) {
  const clave = `dumont-sesion-${codigo}`;
  try {
    let id = localStorage.getItem(clave);
    if (!id || !/^[A-Za-z0-9_-]{16,64}$/.test(id)) {
      const bytes = crypto.getRandomValues(new Uint8Array(24));
      id = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
      localStorage.setItem(clave, id);
    }
    return id;
  } catch {
    // Sin localStorage (modo privado estricto): id solo para esta carga.
    const bytes = crypto.getRandomValues(new Uint8Array(24));
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  }
}

export default function TabletPage() {
  const { codigoDumont } = useParams();

  const [config, setConfig] = useState(null);
  const [errorNotFound, setErrorNotFound] = useState(false);
  const [enUso, setEnUso] = useState(false);
  const [indiceActual, setIndiceActual] = useState(0);
  const [conectado, setConectado] = useState(true);
  // url original -> url local (blob:) ya descargada
  const [urlsLocales, setUrlsLocales] = useState({});
  const ultimaPosicion = useRef({ lat: null, lng: null });
  const blobsRef = useRef({}); // para poder liberar los blobs

  const sync = useCallback(async () => {
    try {
      const body = { sesion: obtenerIdSesion(codigoDumont) };
      if (ultimaPosicion.current.lat != null) {
        body.latitud = ultimaPosicion.current.lat;
        body.longitud = ultimaPosicion.current.lng;
      }

      const res = await axios.post(`${TABLET}/${codigoDumont}/sync`, body);
      setConfig(res.data);
      setErrorNotFound(false);
      setEnUso(false);
      setConectado(true);
    } catch (err) {
      if (err.response?.status === 409) {
        // El link está abierto en otro dispositivo. Se sigue consultando: si
        // el otro se desconecta, este lo toma solo.
        setEnUso(true);
        setConfig((prev) => prev || err.response.data);
        setConectado(true);
      } else if (err.response?.status === 404) {
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

  // GPS continuo (si la tablet/navegador lo permite). watchPosition mantiene
  // siempre la última posición fresca y el sync la manda en cada aviso.
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;

    const id = navigator.geolocation.watchPosition(
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
      { enableHighAccuracy: false, maximumAge: 15000, timeout: 20000 }
    );

    return () => navigator.geolocation.clearWatch(id);
  }, []);

  // Mantener la pantalla prendida. El navegador suelta el bloqueo cuando la
  // pestaña se oculta, así que se vuelve a pedir al volver a primer plano.
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return;

    let lock = null;
    const pedir = async () => {
      try {
        lock = await navigator.wakeLock.request('screen');
      } catch {
        // No soportado o denegado: no es crítico.
      }
    };
    const alCambiarVisibilidad = () => {
      if (document.visibilityState === 'visible') pedir();
    };

    pedir();
    document.addEventListener('visibilitychange', alCambiarVisibilidad);
    return () => {
      document.removeEventListener('visibilitychange', alCambiarVisibilidad);
      lock?.release?.().catch(() => {});
    };
  }, []);

  const playlist = config?.playlist || [];
  const itemActual = playlist.length
    ? playlist[indiceActual % playlist.length]
    : undefined;
  const itemSiguiente =
    playlist.length > 1
      ? playlist[(indiceActual + 1) % playlist.length]
      : undefined;

  // Descarga la playlist al cache local. Mientras no esté lista, el item
  // se reproduce directo desde la red (ver srcDe más abajo).
  const clavePlaylist = playlist.map((i) => i.url).join('|');
  useEffect(() => {
    if (!cacheDisponible()) return;

    const urls = clavePlaylist ? clavePlaylist.split('|') : [];
    let cancelado = false;

    (async () => {
      for (const url of urls) {
        if (cancelado) return;
        if (blobsRef.current[url]) continue;
        try {
          const local = await obtenerUrlLocal(url);
          if (cancelado) {
            URL.revokeObjectURL(local);
            return;
          }
          blobsRef.current[url] = local;
          setUrlsLocales((prev) => ({ ...prev, [url]: local }));
        } catch {
          // Sin conexión o error de descarga: se reintenta en el próximo
          // cambio de playlist; mientras tanto se usa la URL de red.
        }
      }

      // Liberar memoria/espacio de lo que ya no se usa
      const vigentes = new Set(urls);
      Object.keys(blobsRef.current).forEach((url) => {
        if (!vigentes.has(url)) {
          URL.revokeObjectURL(blobsRef.current[url]);
          delete blobsRef.current[url];
          setUrlsLocales((prev) => {
            const { [url]: _, ...resto } = prev;
            return resto;
          });
        }
      });
      limpiarCache(new Set(urls.map((u) => new URL(u, location.href).href))).catch(
        () => {}
      );
    })();

    return () => {
      cancelado = true;
    };
  }, [clavePlaylist]);

  const srcDe = (item) => (item ? urlsLocales[item.url] || item.url : undefined);

  const avanzar = useCallback(() => {
    setIndiceActual((prev) =>
      playlist.length ? (prev + 1) % playlist.length : 0
    );
  }, [playlist.length]);

  // Si el contenido es una imagen, la mostramos por su duración configurada
  // y avanzamos solos. Si es un video, avanza el propio <video onEnded>.
  useEffect(() => {
    if (!itemActual || itemActual.tipo !== 'imagen') return;
    const timeout = setTimeout(
      avanzar,
      (itemActual.duracionSegundos || 8) * 1000
    );
    return () => clearTimeout(timeout);
  }, [itemActual, avanzar]);

  // Si la playlist cambia (nuevo contenido asignado) y el índice quedó
  // fuera de rango, lo reseteamos.
  useEffect(() => {
    if (indiceActual >= playlist.length) setIndiceActual(0);
  }, [playlist.length, indiceActual]);

  // Si un archivo no carga (404, formato no soportado, etc.), esperamos un
  // momento y pasamos al siguiente en vez de dejar la pantalla congelada.
  const alFallarArchivo = useCallback(() => {
    setTimeout(avanzar, 2000);
  }, [avanzar]);

  // ---------- Pantallas de error ----------

  if (enUso) {
    return (
      <PantallaBase>
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
          <h1 className="text-3xl font-bold">Pantalla en uso</h1>
          <p className="text-gray-400 max-w-md">
            Este enlace ya está abierto en otro dispositivo y solo puede estar
            activo en uno a la vez. Si querés usarlo acá, cerrá la otra
            pantalla o pedile a soporte que libere el enlace; este dispositivo
            lo tomará automáticamente.
          </p>
          <ContactoSoporte soporte={config?.soporte || {}} />
        </div>
      </PantallaBase>
    );
  }

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
        <ModoReposo
          cliente={config.cliente}
          conectado={conectado}
          soporte={config.soporte}
        />
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
            src={srcDe(itemActual)}
            alt=""
            onError={alFallarArchivo}
            className="w-full h-full object-contain"
          />
        ) : (
          <video
            key={itemActual?.idMultimedia}
            src={srcDe(itemActual)}
            autoPlay
            muted
            playsInline
            // Con un solo video en la playlist no hay "siguiente": se repite.
            loop={playlist.length === 1}
            onEnded={avanzar}
            onError={alFallarArchivo}
            className="w-full h-full object-contain"
          />
        )}

        {/* Precarga de la próxima imagen para que el corte sea instantáneo */}
        {itemSiguiente?.tipo === 'imagen' && (
          <img src={srcDe(itemSiguiente)} alt="" className="hidden" />
        )}

        <div className="absolute bottom-2 right-3 flex items-center gap-2">
          <EstadoConexion conectado={conectado} compact />
        </div>
      </div>
    </PantallaBase>
  );
}

function PantallaBase({ children }) {
  return (
    <div className="w-screen h-screen bg-black">
      {children}
      <ControlPantallaCompleta />
    </div>
  );
}

// Los navegadores NO permiten entrar en pantalla completa solos al cargar la
// página: exigen un gesto del usuario. Por eso se entra con el primer toque
// (o tecla) en cualquier parte de la pantalla, y queda un botón discreto por
// si alguien sale. Si el navegador no soporta la API (ej. iPhone), no se
// muestra nada. Para arrancar sin tocar nada, instalar la página como app
// ("Agregar a pantalla de inicio") o usar Fully Kiosk Browser.
function ControlPantallaCompleta() {
  const [soportado, setSoportado] = useState(false);
  const [activa, setActiva] = useState(false);

  useEffect(() => {
    const el = document.documentElement;
    const puede = !!(el.requestFullscreen || el.webkitRequestFullscreen);
    setSoportado(puede);
    if (!puede) return;

    const hayPantallaCompleta = () =>
      !!(document.fullscreenElement || document.webkitFullscreenElement);

    const entrar = () => {
      if (hayPantallaCompleta()) return;
      const req = el.requestFullscreen || el.webkitRequestFullscreen;
      try {
        const p = req.call(el);
        if (p && p.catch) p.catch(() => {});
      } catch {
        // El navegador la rechazó: queda el botón manual.
      }
    };

    const alCambiar = () => setActiva(hayPantallaCompleta());
    alCambiar();

    // Primer gesto del usuario: entra en pantalla completa.
    const eventos = ['pointerdown', 'touchend', 'keydown'];
    const alPrimerGesto = () => {
      entrar();
      eventos.forEach((ev) => window.removeEventListener(ev, alPrimerGesto));
    };
    eventos.forEach((ev) => window.addEventListener(ev, alPrimerGesto));

    document.addEventListener('fullscreenchange', alCambiar);
    document.addEventListener('webkitfullscreenchange', alCambiar);
    return () => {
      eventos.forEach((ev) => window.removeEventListener(ev, alPrimerGesto));
      document.removeEventListener('fullscreenchange', alCambiar);
      document.removeEventListener('webkitfullscreenchange', alCambiar);
    };
  }, []);

  if (!soportado || activa) return null;

  return (
    <button
      type="button"
      onClick={() => {
        const el = document.documentElement;
        const req = el.requestFullscreen || el.webkitRequestFullscreen;
        try {
          const p = req.call(el);
          if (p && p.catch) p.catch(() => {});
        } catch {
          // sin soporte real
        }
      }}
      className="absolute left-3 top-3 rounded-md bg-white/15 px-3 py-1.5 text-xs text-white/80 backdrop-blur hover:bg-white/25"
    >
      Tocá para pantalla completa
    </button>
  );
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
