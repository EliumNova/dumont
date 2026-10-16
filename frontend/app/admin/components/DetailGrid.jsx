import React from "react";

// Grilla de "etiqueta / valor" para los modales de detalle. items: [{ label, value }]
// (value puede ser texto o un nodo React; vacío muestra "—").
export default function DetailGrid({ items, columns = "sm:grid-cols-2 lg:grid-cols-3" }) {
  return (
    <dl className={`grid grid-cols-1 gap-3 text-left ${columns}`}>
      {items.map(({ label, value }, i) => (
        <div
          key={label}
          style={{ animationDelay: `${i * 25}ms` }}
          className="mac-fade-up rounded-2xl bg-black/[0.04] px-4 py-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {label}
          </dt>
          <dd className="mt-1 break-words text-sm font-medium text-[#191920]">
            {value === null || value === undefined || value === "" ? "—" : value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
