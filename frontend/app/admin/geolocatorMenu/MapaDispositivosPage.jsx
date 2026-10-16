"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

// Una tablet se considera "en línea" si avisó hace menos de 3 minutos
// (mismo criterio que la tabla de dispositivos y el backend).
const MINUTOS_OFFLINE = 3;

const COLORES = {
  online: "#16a34a", // verde
  offline: "#6b7280", // gris
  respaldo: "#f59e0b", // naranja: ubicación de respaldo del cliente
};

const escapeHtml = (valor) =>
  String(valor ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

const estaOnline = (device) => {
  if (!device.UltimaConexion) return false;
  const minutos =
    (Date.now() - new Date(device.UltimaConexion).getTime()) / 60000;
  return minutos < MINUTOS_OFFLINE;
};

// Devuelve la posición a usar para un dispositivo, o null si no tiene
// ninguna. Prefiere la ubicación propia (GPS de la tablet); si no hay, usa
// las coordenadas de respaldo del cliente.
const obtenerPosicion = (device) => {
  const propia =
    device.latitud != null &&
    device.longitud != null &&
    device.latitud !== "" &&
    device.longitud !== "";
  const lat = propia ? device.latitud : device.Cliente?.Latitud;
  const lng = propia ? device.longitud : device.Cliente?.Longitud;

  if (lat == null || lng == null || lat === "" || lng === "") return null;
  if (Number.isNaN(Number(lat)) || Number.isNaN(Number(lng))) return null;

  return { lat: Number(lat), lng: Number(lng), respaldo: !propia };
};

const estadoDe = (device, posicion) =>
  posicion.respaldo ? "respaldo" : estaOnline(device) ? "online" : "offline";

const crearElementoPin = () => {
  const el = document.createElement("div");
  el.style.width = "22px";
  el.style.height = "22px";
  el.style.borderRadius = "50%";
  el.style.border = "3px solid white";
  el.style.boxShadow = "0 1px 6px rgba(0,0,0,0.45)";
  el.style.cursor = "pointer";
  el.style.transition = "background-color 0.3s";
  return el;
};

const htmlPopup = (device, estado) => {
  const etiqueta = {
    online: "Conectado",
    offline: "Sin conexión",
    respaldo: "Ubicación de respaldo (coordenadas del cliente)",
  }[estado];

  const ultima = device.UltimaConexion
    ? new Date(device.UltimaConexion).toLocaleString("es-AR")
    : "Nunca";

  return `
    <div style="font-size:15px;padding:10px;min-width:220px;line-height:1.5;color:#111;">
      <div style="font-weight:700;margin-bottom:4px;">
        ${escapeHtml(device.Cliente?.NombreCompleto || "Sin cliente")}
      </div>
      <div>${escapeHtml(device.Marca)} ${escapeHtml(device.Modelo)}</div>
      <div><strong>N° Serie:</strong> ${escapeHtml(device.NumSerie)}</div>
      <div><strong>Código DuMont:</strong> ${escapeHtml(device.CodigoDumont)}</div>
      <div style="margin-top:6px;">
        <span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${COLORES[estado]};margin-right:6px;"></span>
        ${etiqueta}
      </div>
      <div style="font-size:12px;color:#666;">Última conexión: ${escapeHtml(ultima)}</div>
    </div>`;
};

export default function MapaDispositivosPage({ dispositivos }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  // idDispositivos -> { marker, popup, el }
  const markersRef = useRef(new Map());
  const yaEncuadro = useRef(false);
  const [resumen, setResumen] = useState({ online: 0, offline: 0, respaldo: 0 });

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-58.3816, -34.6037],
      zoom: 12,
    });
    map.current.addControl(new mapboxgl.NavigationControl(), "bottom-left");

    const markers = markersRef.current;
    return () => {
      markers.forEach(({ marker }) => marker.remove());
      markers.clear();
      map.current?.remove();
      map.current = null;
      yaEncuadro.current = false;
    };
  }, []);

  // El mapa de Mapbox no recalcula su tamaño solo cuando la ventana se
  // redimensiona, maximiza o restaura: se lo avisamos con un ResizeObserver.
  useEffect(() => {
    const el = mapContainer.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const obs = new ResizeObserver(() => map.current?.resize());
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Sincroniza los pines con la lista de dispositivos SIN borrarlos y
  // volverlos a crear en cada refresco: se mueven/actualizan en el lugar,
  // así no parpadean ni se cierra un popup que el usuario tiene abierto.
  useEffect(() => {
    if (!map.current) return;

    const vistos = new Set();
    const cuenta = { online: 0, offline: 0, respaldo: 0 };
    const bounds = new mapboxgl.LngLatBounds();

    dispositivos.forEach((device) => {
      const posicion = obtenerPosicion(device);
      if (!posicion) return; // sin ninguna coordenada: no dibujamos el pin

      const id = device.idDispositivos;
      const estado = estadoDe(device, posicion);
      vistos.add(id);
      cuenta[estado] += 1;
      bounds.extend([posicion.lng, posicion.lat]);

      const existente = markersRef.current.get(id);
      if (existente) {
        existente.marker.setLngLat([posicion.lng, posicion.lat]);
        existente.el.style.backgroundColor = COLORES[estado];
        existente.popup.setHTML(htmlPopup(device, estado));
      } else {
        const el = crearElementoPin();
        el.style.backgroundColor = COLORES[estado];
        const popup = new mapboxgl.Popup({ offset: 18 }).setHTML(
          htmlPopup(device, estado),
        );
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([posicion.lng, posicion.lat])
          .setPopup(popup)
          .addTo(map.current);
        markersRef.current.set(id, { marker, popup, el });
      }
    });

    // Quitar pines de dispositivos que ya no están (o perdieron coordenadas)
    markersRef.current.forEach(({ marker }, id) => {
      if (!vistos.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    setResumen(cuenta);

    // Solo la primera vez ajustamos el zoom para que entren todos; en los
    // refrescos siguientes no movemos la cámara (el usuario puede estar
    // mirando una zona puntual).
    if (!yaEncuadro.current && !bounds.isEmpty()) {
      map.current.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 });
      yaEncuadro.current = true;
    }
  }, [dispositivos]);

  return (
    <div className="w-full h-full">
      <div className="relative w-full h-full">
        {(
          <div className="absolute top-2 left-2 z-10 bg-white/95 rounded-lg shadow px-3 py-2 text-sm text-gray-800 flex flex-col gap-1">
            {[
              ["online", "Conectados"],
              ["offline", "Sin conexión"],
              ["respaldo", "Ubicación de respaldo"],
            ].map(([clave, texto]) => (
              <div key={clave} className="flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full border border-white shadow"
                  style={{ backgroundColor: COLORES[clave] }}
                />
                <span>
                  {texto}: <strong>{resumen[clave]}</strong>
                </span>
              </div>
            ))}
          </div>
        )}

        <div
          ref={mapContainer}
          className="w-full h-full rounded-lg shadow-lg border border-gray-300"
        />
      </div>
    </div>
  );
}
