"use client";

import React, { useMemo } from "react";
import { qrMatriz } from "@/lib/qr";

// Dibuja un QR como SVG (negro sobre blanco, con la zona de silencio que
// exigen los lectores).
export default function QrCode({ value, size = 192 }) {
  const matriz = useMemo(() => {
    try {
      return qrMatriz(value);
    } catch {
      return null;
    }
  }, [value]);

  if (!matriz) return null;
  const n = matriz.length;
  const margen = 4;
  let d = "";
  matriz.forEach((fila, y) =>
    fila.forEach((oscuro, x) => {
      if (oscuro) d += `M${x + margen} ${y + margen}h1v1h-1z`;
    })
  );

  return (
    <svg
      role="img"
      aria-label="Código QR para la app de autenticación"
      viewBox={`0 0 ${n + margen * 2} ${n + margen * 2}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className="rounded-xl bg-white">
      <rect width="100%" height="100%" fill="#fff" />
      <path d={d} fill="#000" />
    </svg>
  );
}
