"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

// Tamaños del contenedor del mapa: normal y minimizado (esquina inferior
// derecha, estilo "picture in picture").
const SIZE_CLASSES = {
  normal: "w-[90vw] h-[75vh]",
  minimized: "w-[320px] h-[220px] fixed bottom-4 right-4 z-40 shadow-2xl",
};

export default function MapaDispositivosPage({ dispositivos }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-58.3816, -34.6037],
      zoom: 12,
    });
  }, []);

  // El mapa de Mapbox no vuelve a calcular su tamaño solo cuando el
  // contenedor cambia de medida (normal <-> minimizado), hay que avisarle.
  useEffect(() => {
    if (!map.current) return;
    const timeout = setTimeout(() => map.current.resize(), 300);
    return () => clearTimeout(timeout);
  }, [minimized]);

  useEffect(() => {
    if (!map.current) return;

    // Limpiar marcadores anteriores antes de volver a dibujar
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    dispositivos.forEach((device) => {
      // Preferimos la ubicación en vivo del dispositivo; si no la tiene
      // (apagado, sin GPS, etc.) usamos las coordenadas de respaldo que
      // carga el vendedor en la ficha del cliente. Si no hay ninguna de las
      // dos, no dibujamos el marcador (evita el pin "en el mar" en 0,0).
      const lng = device.longitud ?? device.Cliente?.Longitud;
      const lat = device.latitud ?? device.Cliente?.Latitud;

      if (lng == null || lat == null || lng === "" || lat === "") return;

      const usandoRespaldo = device.longitud == null || device.latitud == null;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
  <div style="
    font-size: 18px;
    padding: 12px;
    min-width: 220px;
    line-height: 1.5;
  ">
    <div style="margin-bottom: 6px;">
      <strong>Marca:</strong> ${device.Marca}
    </div>
    <div style="margin-bottom: 6px;">
      <strong>Modelo:</strong> ${device.Modelo}
    </div>
    <div style="margin-bottom: 6px;">
      <strong>N° Serie:</strong> ${device.NumSerie}
    </div>
    <div style="margin-bottom: 6px;">
      <strong>Código DuMont:</strong> ${device.CodigoDumont}
    </div>
    <div>
      <strong>Cliente:</strong> ${device.Cliente?.NombreCompleto || 'Sin datos'}
    </div>
    ${
      usandoRespaldo
        ? '<div style="margin-top:6px;color:#a15c00;"><em>Ubicación de respaldo (coordenadas del cliente)</em></div>'
        : ""
    }
  </div>
      `);

      const marker = new mapboxgl.Marker({
        color: usandoRespaldo ? "orange" : "purple",
      })
        .setLngLat([Number(lng), Number(lat)])
        .setPopup(popup)
        .addTo(map.current);

      markersRef.current.push(marker);
    });
  }, [dispositivos]);

  return (
    <div
      className={`flex justify-center items-center transition-all duration-300 ${
        minimized ? SIZE_CLASSES.minimized : SIZE_CLASSES.normal
      }`}
    >
      <div className="relative w-full h-full">
        <button
          type="button"
          onClick={() => setMinimized((prev) => !prev)}
          className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white text-black text-sm px-3 py-1 rounded shadow"
          title={minimized ? "Restaurar mapa" : "Minimizar mapa"}
        >
          {minimized ? "⤢ Restaurar" : "⤡ Minimizar"}
        </button>
        <div
          ref={mapContainer}
          className="w-full h-full rounded-lg shadow-lg border border-gray-300"
        />
      </div>
    </div>
  );
}
