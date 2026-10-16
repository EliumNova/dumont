"use client";

import React, { useEffect, useRef, useState } from "react";
import { FiMinus, FiSquare, FiCopy, FiX } from "react-icons/fi";

const ALTO_NAVBAR = 64; // barra superior del admin
const ALTO_DOCK = 56; // barra de tareas inferior

// Ventana flotante estilo sistema operativo: se arrastra desde la barra de
// título, se redimensiona desde la esquina, y tiene minimizar / maximizar /
// cerrar. Minimizada sigue montada (display:none), así conserva su estado
// (ej. el mapa no se recarga).
export default function VentanaSO({
  titulo,
  icono,
  minimizada,
  maximizada,
  z,
  enfocada,
  indice = 0,
  onEnfocar,
  onMinimizar,
  onMaximizar,
  onCerrar,
  children,
}) {
  const [caja, setCaja] = useState(() => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    const w = Math.min(1100, Math.round(vw * 0.86));
    const h = Math.min(700, Math.round(vh * 0.76));
    const desfase = (indice % 6) * 28;
    return {
      x: Math.max(8, Math.round((vw - w) / 2) + desfase - 70),
      y: ALTO_NAVBAR + 14 + desfase,
      w,
      h,
    };
  });
  const arrastre = useRef(null);

  // En pantallas chicas (celular/tablet vertical) la ventana ocupa toda la
  // pantalla: no se arrastra ni se redimensiona.
  const [esMovil, setEsMovil] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const actualizar = () => setEsMovil(mq.matches);
    actualizar();
    mq.addEventListener("change", actualizar);
    return () => mq.removeEventListener("change", actualizar);
  }, []);
  const pantallaCompleta = maximizada || esMovil;

  const empezarArrastre = (e) => {
    onEnfocar();
    if (pantallaCompleta || e.target.closest("button")) return;
    arrastre.current = { dx: e.clientX - caja.x, dy: e.clientY - caja.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const moverArrastre = (e) => {
    if (!arrastre.current) return;
    const x = Math.min(Math.max(e.clientX - arrastre.current.dx, 120 - caja.w), window.innerWidth - 120);
    const y = Math.min(Math.max(e.clientY - arrastre.current.dy, ALTO_NAVBAR), window.innerHeight - ALTO_DOCK);
    setCaja((c) => ({ ...c, x, y }));
  };
  const terminarArrastre = () => {
    arrastre.current = null;
  };

  const estilo = esMovil
    ? { left: 0, top: 0, right: 0, bottom: ALTO_DOCK, zIndex: 100 + z }
    : maximizada
    ? { left: 0, top: ALTO_NAVBAR, right: 0, bottom: ALTO_DOCK, zIndex: z }
    : { left: caja.x, top: caja.y, width: caja.w, height: caja.h, zIndex: z };

  // Al terminar de redimensionar con la esquina, guardamos el nuevo tamaño.
  const guardarTamano = (e) => {
    if (pantallaCompleta) return;
    const el = e.currentTarget;
    setCaja((c) =>
      c.w === el.offsetWidth && c.h === el.offsetHeight
        ? c
        : { ...c, w: el.offsetWidth, h: el.offsetHeight }
    );
  };

  return (
    <div
      role="dialog"
      aria-label={titulo}
      onMouseDown={onEnfocar}
      onMouseUp={guardarTamano}
      style={{
        ...estilo,
        display: minimizada ? "none" : "flex",
        resize: pantallaCompleta ? "none" : "both",
        minWidth: esMovil ? 0 : 320,
        minHeight: esMovil ? 0 : 220,
      }}
      className={`mac-window-in fixed flex-col overflow-hidden ${esMovil ? "rounded-none" : "rounded-2xl"} bg-white text-[#191920] ${
        enfocada ? "shadow-[0_25px_70px_-10px_rgba(0,0,0,0.55)]" : "shadow-xl opacity-95"
      } ring-1 ring-black/10`}>
      {/* Barra de título */}
      <div
        onPointerDown={empezarArrastre}
        onPointerMove={moverArrastre}
        onPointerUp={terminarArrastre}
        onDoubleClick={onMaximizar}
        className={`flex shrink-0 select-none items-center justify-between gap-3 border-b border-black/5 pl-4 ${
          pantallaCompleta ? "cursor-default" : "cursor-grab active:cursor-grabbing"
        } ${enfocada ? "bg-[#F2F5F6]" : "bg-gray-100 text-gray-500"}`}>
        <div className="flex min-w-0 items-center gap-2 py-2 text-sm font-semibold">
          {icono}
          <span className="truncate">{titulo}</span>
        </div>
        <div className="flex">
          <button type="button" onClick={onMinimizar} aria-label="Minimizar" className="flex h-10 w-12 items-center justify-center transition-colors hover:bg-black/10">
            <FiMinus />
          </button>
          <button type="button" onClick={onMaximizar} aria-label={maximizada ? "Restaurar" : "Maximizar"} className="hidden h-10 w-12 md:flex items-center justify-center transition-colors hover:bg-black/10">
            {maximizada ? <FiCopy className="h-3.5 w-3.5" /> : <FiSquare className="h-3.5 w-3.5" />}
          </button>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className="flex h-10 w-12 items-center justify-center transition-colors hover:bg-red-500 hover:text-white">
            <FiX />
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}

// Barra de tareas: una pastilla por ventana abierta.
export function DockVentanas({ ventanas, idEnfocada, onClick }) {
  if (!ventanas.length) return null;
  return (
    <div className="pointer-events-none fixed bottom-2 left-0 right-0 z-[900] flex justify-center">
      <div className="mac-pop pointer-events-auto mac-glass flex max-w-[95vw] gap-1 overflow-x-auto rounded-2xl p-1.5">
        {ventanas.map((v) => {
          const activa = v.id === idEnfocada && !v.minimizada;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onClick(v.id)}
              title={v.minimizada ? "Restaurar" : "Ventana abierta"}
              className={`mac-press flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium ${
                activa ? "bg-blue-500 text-white" : v.minimizada ? "bg-black/5 text-gray-500" : "bg-white text-[#191920]"
              }`}>
              {v.icono}
              {v.titulo}
            </button>
          );
        })}
      </div>
    </div>
  );
}
