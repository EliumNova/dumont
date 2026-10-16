'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

// Modal base estilo macOS: fondo desenfocado, entrada con rebote suave,
// cierra con Esc o clic en el fondo, bloquea el scroll de la página y
// scrollea por dentro si el contenido es largo.
//
// Props:
//  - isOpen / onClose
//  - title: título opcional en la cabecera
//  - footer: false oculta el botón "Cerrar" (ej. confirmaciones con sus botones)
//  - maxWidth: clase tailwind de ancho máximo (por defecto max-w-4xl)
export default function MacModal({
  isOpen,
  onClose,
  title,
  children,
  footer = true,
  maxWidth = 'max-w-4xl',
  zIndex = 'z-50',
}) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`mac-overlay fixed inset-0 ${zIndex} flex items-center justify-center p-3 sm:p-6`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : undefined}>
      <div
        className={`mac-modal mac-glass relative flex max-h-[90vh] w-full ${maxWidth} flex-col rounded-3xl text-[#191920]`}>
        <div className="flex items-center justify-between gap-4 px-6 pt-5">
          {title ? (
            <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="mac-press flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-lg leading-none text-gray-600 hover:bg-black/10">
            ×
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end border-t border-black/5 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="mac-press rounded-xl bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-600">
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
