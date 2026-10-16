import React from "react";

export const fieldCls =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

// Campo con etiqueta: <input> por defecto, <select> si se pasan `options`.
export default function Field({ label, options, className = "", ...props }) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm font-medium text-[#191920] ${className}`}>
      {label}
      {options ? (
        <select className={fieldCls} {...props}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input className={fieldCls} {...props} />
      )}
    </label>
  );
}
