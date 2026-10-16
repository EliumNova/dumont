"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiUser, FiTruck, FiChevronRight, FiBriefcase } from "react-icons/fi";
import MacModal from "./MacModal";
import DetailGrid from "./DetailGrid";
import { formatTelefono, formatCUIT } from "@/lib/formato";

// Buscador global estilo "Spotlight": una sola ventana con navegación
// buscar → perfil → cartera → perfil del cliente…, con flecha para volver
// atrás (sin perder lo que se estaba buscando).
const norm = (t) =>
  String(t ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const FILTROS = [
  ["todos", "Todos"],
  ["cliente", "Clientes"],
  ["distribuidor", "Distribuidores"],
];

// Clientes que pertenecen a un distribuidor (por código o por la relación).
const carteraDe = (dist, clientes) => {
  const codigo = String(dist.CodigoDistribuidor);
  return clientes.filter(
    (c) =>
      String(c.CodigoDistribuidor) === codigo ||
      (Array.isArray(c.Distribuidores) &&
        c.Distribuidores.some(
          (d) => String(d.ClientesDistribuidores?.DistribuidorIdDistribuidores) === codigo
        ))
  );
};

const Avatar = ({ tipo, nombre }) => (
  <span
    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold ${
      tipo === "cliente" ? "bg-blue-100 text-blue-600" : "bg-violet-100 text-violet-600"
    }`}>
    {String(nombre || "?").trim().charAt(0).toUpperCase()}
  </span>
);

export default function BuscadorSO({ isOpen, onClose, clientes = [], distribuidores = [] }) {
  const [pila, setPila] = useState([{ vista: "buscar" }]);
  const [query, setQuery] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [activo, setActivo] = useState(0);
  const inputRef = useRef(null);

  // Cada vez que se abre, arranca limpio.
  useEffect(() => {
    if (isOpen) {
      setPila([{ vista: "buscar" }]);
      setQuery("");
      setFiltro("todos");
      setActivo(0);
    }
  }, [isOpen]);

  const actual = pila[pila.length - 1];
  const ir = (paso) => setPila((p) => [...p, paso]);
  const volver = () => setPila((p) => (p.length > 1 ? p.slice(0, -1) : p));

  const items = useMemo(
    () => [
      ...clientes.map((c) => ({
        tipo: "cliente",
        id: c.idClientes,
        nombre: c.NombreCompleto || "",
        codigo: c.CodigoCliente || "",
        localidad: c.Localidad || "",
        email: c.CorreoElectronico || "",
        dumont: c.CodigoDumont || "",
        raw: c,
      })),
      ...distribuidores.map((d) => ({
        tipo: "distribuidor",
        id: d.idDistribuidor,
        nombre: d.NombreComercial || d.RazonSocial || "",
        codigo: d.CodigoDistribuidor || "",
        localidad: d.Localidad || "",
        email: d.Email || "",
        dumont: "",
        raw: d,
      })),
    ],
    [clientes, distribuidores]
  );

  const resultados = useMemo(() => {
    const palabras = norm(query).split(/\s+/).filter(Boolean);
    return items
      .filter((i) => filtro === "todos" || i.tipo === filtro)
      .filter((i) => {
        const pajar = norm(`${i.nombre} ${i.codigo} ${i.localidad} ${i.email} ${i.dumont} ${i.raw.Calle || ""} ${i.raw.CUIT || ""}`);
        return palabras.every((p) => pajar.includes(p));
      })
      .slice(0, 50);
  }, [items, query, filtro]);

  useEffect(() => setActivo(0), [query, filtro]);
  useEffect(() => {
    if (isOpen && actual.vista === "buscar") inputRef.current?.focus();
  }, [isOpen, actual.vista]);

  const teclas = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActivo((i) => Math.min(i + 1, resultados.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActivo((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && resultados[activo]) {
      e.preventDefault();
      ir({ vista: "perfil", item: resultados[activo] });
    }
  };

  const titulo =
    actual.vista === "buscar"
      ? "Buscar"
      : actual.vista === "perfil"
      ? actual.item.tipo === "cliente"
        ? "Perfil del cliente"
        : "Perfil del distribuidor"
      : `Cartera de ${actual.dist.NombreComercial || "distribuidor"}`;

  return (
    <MacModal
      isOpen={isOpen}
      onClose={onClose}
      onBack={actual.vista !== "buscar" ? volver : undefined}
      title={titulo}
      footer={false}
      maxWidth="max-w-2xl">
      {/* ── BUSCAR ── */}
      {actual.vista === "buscar" && (
        <div className="flex flex-col gap-3">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={teclas}
              placeholder="Nombre, código, localidad, calle, mail, CUIT…"
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1.5 rounded-xl bg-black/5 p-1">
              {FILTROS.map(([valor, texto]) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => setFiltro(valor)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                    filtro === valor ? "bg-white shadow text-[#191920]" : "text-gray-500 hover:text-gray-800"
                  }`}>
                  {texto}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {resultados.length} resultado{resultados.length === 1 ? "" : "s"}
            </span>
          </div>

          <ul className="max-h-[48vh] divide-y divide-black/5 overflow-y-auto rounded-2xl border border-black/5 bg-white">
            {resultados.length === 0 ? (
              <li className="p-8 text-center text-sm text-gray-500">Sin resultados para “{query}”.</li>
            ) : (
              resultados.map((i, idx) => (
                <li key={`${i.tipo}-${i.id}`}>
                  <button
                    type="button"
                    onClick={() => ir({ vista: "perfil", item: i })}
                    onMouseEnter={() => setActivo(idx)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                      idx === activo ? "bg-blue-50" : ""
                    }`}>
                    <Avatar tipo={i.tipo} nombre={i.nombre} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold">{i.nombre || "Sin nombre"}</span>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            i.tipo === "cliente" ? "bg-blue-100 text-blue-700" : "bg-violet-100 text-violet-700"
                          }`}>
                          {i.tipo === "cliente" ? "Cliente" : "Distribuidor"}
                        </span>
                      </span>
                      <span className="block truncate text-xs text-gray-500">
                        Cód. {i.codigo || "—"} · {i.localidad || "Sin localidad"}
                        {i.email ? ` · ${i.email}` : ""}
                      </span>
                    </span>
                    <FiChevronRight className="shrink-0 text-gray-400" />
                  </button>
                </li>
              ))
            )}
          </ul>
          <p className="text-center text-[11px] text-gray-400">↑ ↓ para moverte · Enter para abrir · Esc para cerrar</p>
        </div>
      )}

      {/* ── PERFIL ── */}
      {actual.vista === "perfil" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar tipo={actual.item.tipo} nombre={actual.item.nombre} />
            <div>
              <p className="text-lg font-semibold">{actual.item.nombre}</p>
              <p className="flex items-center gap-1 text-xs text-gray-500">
                {actual.item.tipo === "cliente" ? <FiUser /> : <FiTruck />}
                {actual.item.tipo === "cliente" ? "Cliente" : "Distribuidor"}
              </p>
            </div>
          </div>

          {actual.item.tipo === "cliente" ? (
            <DetailGrid
              columns="sm:grid-cols-2"
              items={[
                { label: "Código cliente", value: actual.item.raw.CodigoCliente },
                { label: "Código DuMont", value: actual.item.raw.CodigoDumont },
                {
                  label: "Dirección",
                  value: [actual.item.raw.Calle, actual.item.raw.Altura].filter(Boolean).join(" "),
                },
                { label: "Localidad", value: actual.item.raw.Localidad },
                { label: "Teléfono", value: formatTelefono(actual.item.raw.Telefono) },
                { label: "Email", value: actual.item.raw.CorreoElectronico },
                { label: "Segmentación", value: actual.item.raw.Segmentacion },
                { label: "Horario de venta", value: actual.item.raw.HorarioVenta },
              ]}
            />
          ) : (
            <>
              <DetailGrid
                columns="sm:grid-cols-2"
                items={[
                  { label: "Código distribuidor", value: actual.item.raw.CodigoDistribuidor },
                  { label: "Razón social", value: actual.item.raw.RazonSocial },
                  { label: "CUIT", value: formatCUIT(actual.item.raw.CUIT) },
                  { label: "Localidad", value: actual.item.raw.Localidad },
                  { label: "Dirección", value: actual.item.raw.Calle },
                  { label: "Teléfono", value: formatTelefono(actual.item.raw.Telefono) },
                  { label: "Email", value: actual.item.raw.Email },
                ]}
              />
              <button
                type="button"
                onClick={() => ir({ vista: "cartera", dist: actual.item.raw })}
                className="mac-press flex items-center justify-center gap-2 rounded-2xl bg-blue-500 py-3 text-sm font-medium text-white hover:bg-blue-600">
                <FiBriefcase /> Ver cartera de clientes
              </button>
            </>
          )}
        </div>
      )}

      {/* ── CARTERA ── */}
      {actual.vista === "cartera" && (
        <CarteraLista
          dist={actual.dist}
          clientes={clientes}
          onElegir={(c) =>
            ir({
              vista: "perfil",
              item: {
                tipo: "cliente",
                id: c.idClientes,
                nombre: c.NombreCompleto,
                codigo: c.CodigoCliente,
                raw: c,
              },
            })
          }
        />
      )}
    </MacModal>
  );
}

function CarteraLista({ dist, clientes, onElegir }) {
  const lista = useMemo(() => carteraDe(dist, clientes), [dist, clientes]);
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-500">
        {lista.length} cliente{lista.length === 1 ? "" : "s"} en la cartera
      </p>
      {lista.length === 0 ? (
        <p className="rounded-2xl bg-black/5 p-8 text-center text-sm text-gray-500">
          Este distribuidor no tiene clientes asignados.
        </p>
      ) : (
        <ul className="max-h-[50vh] divide-y divide-black/5 overflow-y-auto rounded-2xl border border-black/5 bg-white">
          {lista.map((c) => (
            <li key={c.idClientes}>
              <button
                type="button"
                onClick={() => onElegir(c)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-blue-50">
                <Avatar tipo="cliente" nombre={c.NombreCompleto} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{c.NombreCompleto || "—"}</span>
                  <span className="block truncate text-xs text-gray-500">
                    {[c.Calle, c.Altura].filter(Boolean).join(" ")}
                    {c.Localidad ? ` · ${c.Localidad}` : ""}
                    {c.Telefono ? ` · ${formatTelefono(c.Telefono)}` : ""}
                  </span>
                </span>
                <FiChevronRight className="shrink-0 text-gray-400" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
