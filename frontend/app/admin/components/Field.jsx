import React from "react";
import { FORMATOS, soloDigitos } from "@/lib/formato";

export const fieldCls =
  "w-full rounded-xl border bg-white px-3.5 py-2 text-sm text-black outline-none transition focus:ring-2";
const okCls = "border-gray-300 focus:border-blue-500 focus:ring-blue-200";
const errCls = "border-red-400 focus:border-red-500 focus:ring-red-200";

// Campo con etiqueta: <input> por defecto, <select> si se pasan `options`.
//
// Props extra:
//  - formato: 'telefono' | 'dni' | 'cuit' | 'numero'. El usuario ve el valor
//    formateado (ej. "11 5555-5555") pero onChange recibe SOLO LOS DÍGITOS
//    ("1155555555"), que es lo que debe guardarse en la base de datos.
//  - error: mensaje de validación (pinta el borde en rojo y lo muestra debajo).
//  - hint: texto de ayuda debajo del campo.
export default function Field({
  label,
  options,
  className = "",
  formato,
  error,
  hint,
  onChange,
  value,
  ...props
}) {
  const cfg = formato ? FORMATOS[formato] : null;
  const cls = `${fieldCls} ${error ? errCls : okCls}`;

  const manejarCambio = cfg
    ? (e) => {
        const digitos = soloDigitos(e.target.value).slice(0, cfg.maxDigitos);
        onChange?.({ target: { name: props.name ?? e.target.name, value: digitos } });
      }
    : onChange;

  return (
    <label className={`flex flex-col gap-1 text-sm font-medium text-[#191920] ${className}`}>
      {label}
      {options ? (
        <select className={cls} value={value} onChange={onChange} {...props}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={cls}
          value={cfg ? cfg.formatear(value) : value}
          onChange={manejarCambio}
          inputMode={cfg?.inputMode}
          aria-invalid={error ? true : undefined}
          {...props}
        />
      )}
      {error ? (
        <span className="mac-shake text-xs font-normal text-red-600">{error}</span>
      ) : hint ? (
        <span className="text-xs font-normal text-gray-500">{hint}</span>
      ) : null}
    </label>
  );
}
