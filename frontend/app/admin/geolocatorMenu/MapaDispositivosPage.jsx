"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function MapaDispositivosPage({ dispositivos }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-58.3816, -34.6037],
      zoom: 12,
    });

    dispositivos.forEach((device) => {
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
      <strong>Cliente:</strong> ${device.CodigoCliente}
    </div>
  </div>
      `);

      new mapboxgl.Marker({ color: "purple" })
        .setLngLat([device.longitud, device.latitud])
        .setPopup(popup)
        .addTo(map.current);
    });
  }, [dispositivos]);

  return (
    <div className="w-[90vw] h-[75vh] flex justify-center items-center">
      <div
        ref={mapContainer}
        className="w-full h-full rounded-lg shadow-lg border border-gray-300"
      />
    </div>
  );
}
