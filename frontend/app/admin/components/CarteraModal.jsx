"use client";

import { useEffect, useState } from "react";

export default function CarteraModal({ distribuidor, clientesAll, onClose }) {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    if (!distribuidor || !clientesAll) return;

    // Identificadores del distribuidor
    const distribuidorCodigo =
      distribuidor.raw?.CodigoDistribuidor || distribuidor.CodigoDistribuidor;
    const distribuidorId = distribuidor.raw?.idDistribuidor || distribuidor.id;

    // Filtramos clientes asignados a este distribuidor
    const clientesDistribuidor = clientesAll.filter((c) => {
      // 1️⃣ Por CodigoDistribuidor directo
      if (String(c.CodigoDistribuidor) === String(distribuidorCodigo))
        return true;

      // 2️⃣ Por array Distribuidores
      if (Array.isArray(c.Distribuidores)) {
        return c.Distribuidores.some((d) => {
          const distribId =
            d.ClientesDistribuidores?.DistribuidorIdDistribuidores;
          return (
            String(distribId) === String(distribuidorId) ||
            String(distribId) === String(distribuidorCodigo)
          );
        });
      }

      return false;
    });

    setClientes(clientesDistribuidor);
  }, [distribuidor, clientesAll]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-[500px] max-h-[80vh] overflow-auto">
        <h2 className="text-xl font-bold mb-3">
          Cartera de{" "}
          {distribuidor.name || distribuidor.NombreComercial || "Distribuidor"}
        </h2>

        {clientes.length === 0 ? (
          <p className="text-gray-500">
            Este distribuidor no tiene clientes asignados.
          </p>
        ) : (
          <ul className="space-y-2">
            {clientes.map((c) => (
              <li key={c.idClientes} className="p-3 rounded bg-gray-100">
                <p>
                  <strong>{c.NombreCompleto || "—"}</strong>
                </p>
                <p>
                  {c.localidad || "—"} — {c.calle || "—"} {c.altura || ""}
                </p>
                <p>
                  <strong>Tel:</strong> {c.Telefono || "—"}
                </p>
                <p>
                  <strong>Email:</strong> {c.CorreoElectronico || "—"}
                </p>
              </li>
            ))}
          </ul>
        )}

        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
          onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
