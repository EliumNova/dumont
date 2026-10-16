"use client";

import React from "react";
import MacModal from "./MacModal";

// Confirmación estilo macOS (descartar cambios, eliminar, etc.).
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  danger = true,
  onConfirm,
  onCancel,
}) {
  return (
    <MacModal
      isOpen={isOpen}
      onClose={onCancel}
      footer={false}
      maxWidth="max-w-sm"
      zIndex="z-[70]">
      <div className="py-2 text-center">
        <div
          className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-2xl font-bold ${
            danger ? "bg-red-100 text-red-500" : "bg-blue-100 text-blue-500"
          }`}>
          !
        </div>
        <h3 className="mb-1 text-lg font-semibold">{title}</h3>
        {message && <p className="mb-5 text-sm text-gray-600">{message}</p>}
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="mac-press rounded-xl border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-gray-100">
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`mac-press rounded-xl px-5 py-2 text-sm font-medium text-white ${
              danger ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
            }`}>
            {confirmText}
          </button>
        </div>
      </div>
    </MacModal>
  );
}
