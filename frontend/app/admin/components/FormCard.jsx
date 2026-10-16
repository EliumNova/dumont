"use client";

import React from "react";
import { FiArrowLeft } from "react-icons/fi";

// Contenedor común de los formularios de alta/edición: tarjeta de vidrio con
// scroll propio, título, subtítulo y (opcional) botón de volver.
export default function FormCard({
  title,
  subtitle,
  onBack,
  maxWidth = "max-w-4xl",
  children,
}) {
  return (
    <div className="h-full overflow-y-auto px-3 py-4 sm:px-6">
      <div className={`mac-fade-up mac-glass mx-auto rounded-3xl p-5 text-[#191920] sm:p-8 ${maxWidth}`}>
        <div className="mb-6 flex items-start gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Volver"
              className="mac-press mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/5 hover:bg-black/10">
              <FiArrowLeft />
            </button>
          )}
          <div>
            <h2 className="text-2xl font-semibold">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Seccion({ titulo, children, className = "" }) {
  return (
    <section className={`mb-6 ${className}`}>
      {titulo && (
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">{titulo}</h3>
      )}
      <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function BotonesForm({ onCancel, cancelText = "Cancelar", submitText = "Guardar", loading, disabled }) {
  return (
    <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mac-press rounded-xl border border-gray-300 px-6 py-2.5 text-sm font-medium hover:bg-gray-100">
          {cancelText}
        </button>
      )}
      <button
        type="submit"
        disabled={loading || disabled}
        className="mac-press rounded-xl bg-blue-500 px-8 py-2.5 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60">
        {loading ? "Guardando…" : submitText}
      </button>
    </div>
  );
}

export function Aviso({ children, tipo = "error" }) {
  if (!children) return null;
  const cls = tipo === "error" ? "bg-red-50 text-red-600 mac-shake" : "bg-green-50 text-green-700";
  return <p className={`mb-3 rounded-xl px-4 py-2 text-sm ${cls}`}>{children}</p>;
}
