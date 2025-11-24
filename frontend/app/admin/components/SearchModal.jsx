// app/admin/components/SearchModal.jsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DistributorClientsModal from "./DistributorClientsModal";

export default function SearchModal({ isOpen, onClose }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [distribuidores, setDistribuidores] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;
  const inputRef = useRef(null);

  // For distributor clients modal
  const [selectedDistrib, setSelectedDistrib] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setQuery("");
    setResults([]);
    setPage(0);
    // focus input a tiny delay
    setTimeout(() => inputRef.current?.focus(), 50);
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  async function loadAll() {
    setLoading(true);
    try {
      // Traemos TODO con pageSize grande para el buscador
      const [r1, r2] = await Promise.all([
        axios.get("/api/clientes?page=0&pageSize=10000"),
        axios.get("/api/distribuidores?page=0&pageSize=10000"),
      ]);

      setClientes(r1.data.rows || []);
      setDistribuidores(r2.data.rows || []);
    } catch (err) {
      console.error("Error cargando datos del buscador", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();

    const mappedClientes = clientes.map((c) => ({
      type: "cliente",
      id: c.id || c.idCliente || c.idClientes,
      name: c.RazonSocial || c.Nombre || c.NombreCompleto || "",
      codigo: c.CodigoCliente || c.codigo || "",
      localidad: c.Localidad || "",
      email: c.Email || c.CorreoElectronico || "",
      raw: c,
    }));

    const mappedDistrib = distribuidores.map((d) => ({
      type: "distribuidor",
      id: d.id || d.idDistribuidor,
      name: d.NombreComercial || d.RazonSocial || "",
      codigo: d.CodigoDistribuidor || d.codigo || "",
      localidad: d.Localidad || "",
      email: d.Email || d.CorreoElectronico || "",
      raw: d,
    }));

    const merged = [...mappedClientes, ...mappedDistrib];

    const filtered = merged.filter((it) => {
      return (
        (it.name && it.name.toLowerCase().includes(q)) ||
        (it.codigo && String(it.codigo).toLowerCase().includes(q)) ||
        (it.localidad && String(it.localidad).toLowerCase().includes(q)) ||
        (it.raw?.CorreoElectronico &&
          it.raw.CorreoElectronico.toLowerCase().includes(q)) ||
        (it.raw?.Email && it.raw.Email.toLowerCase().includes(q))
      );
    });

    setResults(filtered);
    setPage(0);
  }, [query, clientes, distribuidores]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") {
        // open first result
        if (results.length > 0) selectResult(results[0]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  if (!isOpen) return null;

  const totalPages = Math.ceil(results.length / PAGE_SIZE);
  const pageStart = page * PAGE_SIZE;
  const paged = results.slice(pageStart, pageStart + PAGE_SIZE);

  function selectResult(item) {
    onClose();
    if (item.type === "cliente") {
      router.push(`/admin/clientes/${item.id}`);
    } else {
      router.push(`/admin/distribuidores/${item.id}`);
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
        onClick={onClose}>
        <div
          className="bg-white rounded-lg w-11/12 max-w-3xl p-4 shadow-xl relative"
          onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, código o localidad (clientes y distribuidores)..."
              className="flex-1 border rounded p-3"
            />
            <button
              onClick={onClose}
              className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200">
              Cerrar
            </button>
          </div>

          <div className="mt-3">
            {loading && (
              <p className="text-sm text-gray-500">Cargando datos...</p>
            )}
            {!loading && query.trim() === "" && (
              <p className="text-sm text-gray-400">Escribe para buscar...</p>
            )}
            {!loading && query.trim() !== "" && results.length === 0 && (
              <p className="text-sm text-gray-500">Sin resultados.</p>
            )}

            {!loading && paged.length > 0 && (
              <>
                <div className="mt-2 max-h-64 overflow-y-auto divide-y">
                  {paged.map((it, idx) => (
                    <div
                      key={`${it.type}-${it.id}-${idx}`}
                      className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-start">
                      <div onClick={() => selectResult(it)} className="flex-1">
                        <div className="font-semibold">
                          {it.type === "cliente" ? "🛒 " : "🚚 "}
                          {it.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Código: {it.codigo} —{" "}
                          {it.localidad || "Sin localidad"}
                        </div>
                      </div>

                      {it.type === "distribuidor" && (
                        <div className="ml-4 flex flex-col gap-2">
                          <button
                            onClick={() => {
                              // abrir modal de cartera; pasamos raw
                              setSelectedDistrib(it.raw);
                              // no cerrar el modal principal — abrir submodal
                            }}
                            className="px-2 py-1 bg-blue-500 text-white rounded">
                            Ver cartera
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Paginación */}
                <div className="mt-3 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {results.length} resultado(s)
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="px-2 py-1 rounded bg-gray-100 disabled:opacity-50">
                      Anterior
                    </button>
                    <span className="text-sm text-gray-600">
                      {page + 1} / {Math.max(1, totalPages)}
                    </span>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages - 1, p + 1))
                      }
                      disabled={page + 1 >= totalPages}
                      className="px-2 py-1 rounded bg-gray-100 disabled:opacity-50">
                      Siguiente
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Distributor clients modal */}
          {selectedDistrib && (
            <DistributorClientsModal
              clientes={selectedDistrib.Clientes || []}
              close={() => setSelectedDistrib(null)}
              distribuidor={selectedDistrib}
            />
          )}
        </div>
      </div>
    </>
  );
}
