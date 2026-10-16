"use client";

import React, { useEffect, useRef, useState } from "react";
import { FiMapPin, FiSearch } from "react-icons/fi";
import { fieldCls } from "./Field";

// Buscador de direcciones con autocompletado (Mapbox Geocoding, el mismo
// token que ya usa el mapa: NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN). Al elegir una
// sugerencia llama onSelect con la dirección separada en campos:
//   { Calle, Altura, Localidad, Provincia, CodigoPostal, Latitud, Longitud }
const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const contexto = (feature, prefijo) =>
  (feature.context || []).find((c) => String(c.id).startsWith(prefijo))?.text || "";

export function parsearFeature(feature, consulta = "") {
  const calle = feature.text || "";
  // Mapbox a veces no trae la altura en `address`: se intenta sacar de lo escrito.
  const numeroEscrito = String(consulta).match(/(\d{1,5})\s*$/)?.[1] || "";
  const altura = feature.address || numeroEscrito || "";
  const [lng, lat] = feature.center || [];
  return {
    Calle: calle,
    Altura: String(altura),
    Localidad:
      contexto(feature, "locality") || contexto(feature, "place") || contexto(feature, "neighborhood"),
    Provincia: contexto(feature, "region"),
    CodigoPostal: contexto(feature, "postcode"),
    Latitud: lat != null ? String(lat) : "",
    Longitud: lng != null ? String(lng) : "",
    texto: feature.place_name || "",
  };
}

export default function AddressAutocomplete({
  label = "Buscar dirección",
  placeholder = "Escribí calle y altura (ej. Martín García 777, Virrey del Pino)",
  onSelect,
  className = "",
}) {
  const [texto, setTexto] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(-1);
  const [cargando, setCargando] = useState(false);
  const [aviso, setAviso] = useState("");
  const caja = useRef(null);
  const elegido = useRef(false);

  useEffect(() => {
    const cerrar = (e) => caja.current && !caja.current.contains(e.target) && setAbierto(false);
    document.addEventListener("mousedown", cerrar);
    return () => document.removeEventListener("mousedown", cerrar);
  }, []);

  useEffect(() => {
    if (elegido.current) {
      elegido.current = false;
      return undefined;
    }
    const q = texto.trim();
    if (!TOKEN || q.length < 4) {
      setSugerencias([]);
      return undefined;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        setCargando(true);
        const url =
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json` +
          `?access_token=${TOKEN}&country=ar&language=es&autocomplete=true&limit=6&types=address,poi`;
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        setSugerencias(data.features || []);
        setAviso(data.features?.length ? "" : "Sin resultados. Podés completar los campos a mano.");
        setAbierto(true);
        setActivo(-1);
      } catch (e) {
        if (e.name !== "AbortError") setAviso("No se pudo buscar la dirección. Completá los campos a mano.");
      } finally {
        setCargando(false);
      }
    }, 350);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [texto]);

  const elegir = (feature) => {
    const datos = parsearFeature(feature, texto);
    elegido.current = true;
    setTexto(datos.texto);
    setAbierto(false);
    setSugerencias([]);
    onSelect?.(datos);
  };

  const teclas = (e) => {
    if (!abierto || !sugerencias.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActivo((i) => (i + 1) % sugerencias.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActivo((i) => (i <= 0 ? sugerencias.length - 1 : i - 1));
    } else if (e.key === "Enter" && activo >= 0) {
      e.preventDefault();
      elegir(sugerencias[activo]);
    } else if (e.key === "Escape") {
      setAbierto(false);
    }
  };

  if (!TOKEN) {
    return (
      <p className={`rounded-xl bg-amber-50 px-4 py-2 text-xs text-amber-700 ${className}`}>
        El autocompletado de direcciones necesita <code>NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code>. Mientras tanto,
        completá los campos a mano.
      </p>
    );
  }

  return (
    <div className={`relative ${className}`} ref={caja}>
      <label className="flex flex-col gap-1 text-sm font-medium text-[#191920]">
        {label}
        <span className="relative">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={teclas}
            onFocus={() => sugerencias.length && setAbierto(true)}
            placeholder={placeholder}
            autoComplete="off"
            className={`${fieldCls} border-gray-300 pl-9 focus:border-blue-500 focus:ring-blue-200`}
          />
          {cargando && (
            <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          )}
        </span>
      </label>
      {aviso && !abierto && <span className="mt-1 block text-xs text-gray-500">{aviso}</span>}

      {abierto && sugerencias.length > 0 && (
        <ul className="mac-pop absolute left-0 right-0 z-50 mt-1 max-h-64 overflow-auto rounded-2xl border border-black/5 bg-white py-1 shadow-2xl" role="listbox">
          {sugerencias.map((f, i) => (
            <li key={f.id} role="option" aria-selected={i === activo}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => elegir(f)}
                onMouseEnter={() => setActivo(i)}
                className={`flex w-full items-start gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                  i === activo ? "bg-blue-500 text-white" : "hover:bg-blue-50"
                }`}>
                <FiMapPin className="mt-0.5 shrink-0" />
                <span>
                  <span className="block font-medium">{f.text}{f.address ? ` ${f.address}` : ""}</span>
                  <span className={`block text-xs ${i === activo ? "text-white/80" : "text-gray-500"}`}>{f.place_name}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
