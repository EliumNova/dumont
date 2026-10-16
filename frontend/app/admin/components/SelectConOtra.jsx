"use client";

import React, { useState } from "react";
import { fieldCls } from "./Field";

const OTRA = "__otra__";

// Lista desplegable con opción "Otra…": si el valor no está en la lista, el
// usuario lo escribe y queda como valor del campo (el padre decide si lo
// guarda para que aparezca la próxima vez).
export default function SelectConOtra({
  label,
  value,
  onChange,
  options = [],
  error,
  hint,
  placeholder = "Seleccioná…",
  otraLabel = "Otra…",
  otraPlaceholder = "Escribí el nombre",
}) {
  const [forzarOtra, setForzarOtra] = useState(false);
  const enLista = options.includes(value);
  const modoOtra = forzarOtra || (value !== "" && !enLista);

  const cls = `${fieldCls} ${error ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"}`;

  return (
    <div className="flex flex-col gap-1 text-sm font-medium text-[#191920]">
      <label className="flex flex-col gap-1">
        {label}
        <select
          className={cls}
          value={modoOtra ? OTRA : value}
          onChange={(e) => {
            if (e.target.value === OTRA) {
              setForzarOtra(true);
              onChange("");
            } else {
              setForzarOtra(false);
              onChange(e.target.value);
            }
          }}>
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
          <option value={OTRA}>{otraLabel}</option>
        </select>
      </label>
      {modoOtra && (
        <input
          autoFocus
          className={`${cls} mac-fade-up`}
          value={value}
          placeholder={otraPlaceholder}
          maxLength={45}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {error ? (
        <span className="mac-shake text-xs font-normal text-red-600">{error}</span>
      ) : hint ? (
        <span className="text-xs font-normal text-gray-500">{hint}</span>
      ) : null}
    </div>
  );
}
