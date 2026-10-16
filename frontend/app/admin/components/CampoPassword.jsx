"use client";

import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { fieldCls } from "./Field";

// Nivel de seguridad 0-4 según longitud y variedad de caracteres.
export const fuerzaPassword = (p = "") => {
  let n = 0;
  if (p.length >= 10) n += 1;
  if (/[A-Za-z]/.test(p) && /\d/.test(p)) n += 1;
  if (/[\W_]/.test(p)) n += 1;
  if (p.length >= 14) n += 1;
  return n;
};
const ETIQ = ["Muy débil", "Débil", "Aceptable", "Buena", "Excelente"];
const COL = ["bg-red-400", "bg-red-400", "bg-amber-400", "bg-lime-500", "bg-green-500"];

export default function CampoPassword({ label, value, onChange, name, error, medidor = false, ...props }) {
  const [ver, setVer] = useState(false);
  const f = fuerzaPassword(value);
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-[#191920]">
      {label}
      <span className="relative">
        <input
          type={ver ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className={`${fieldCls} pr-10 ${error ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVer((v) => !v)}
          aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-500 hover:bg-black/5">
          {ver ? <FiEyeOff /> : <FiEye />}
        </button>
      </span>
      {medidor && value && (
        <span className="flex items-center gap-2">
          <span className="flex h-1.5 flex-1 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`h-full flex-1 rounded-full ${i < f ? COL[f] : "bg-gray-200"}`} />
            ))}
          </span>
          <span className="text-xs font-normal text-gray-500">{ETIQ[f]}</span>
        </span>
      )}
      {error && <span className="mac-shake text-xs font-normal text-red-600">{error}</span>}
    </label>
  );
}
