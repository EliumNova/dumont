"use client";

import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import UserMenu from "./userMenu/page.js";
import ClientMenu from "./clientMenu/page.js";
import DevicesMenu from "./devicesMenu/page.js";
import CommunicationMenu from "./communicationMenu/page.js";
import DistribuidorMenu from "./distributorMenu/page.js";
import GeolocatorMenu from "./geolocatorMenu/page.js";

import { Search } from "lucide-react";

import VentanaSO, { DockVentanas } from "./components/VentanaSO";
import ProfileModal from "./components/ProfileModal";
import CarteraModal from "./components/CarteraModal";

import { fetchClients } from "@/lib/slices/clients/clientAction";
import { getDistribuidores } from "@/lib/slices/distribuidores/distribuidorAction";

const MENUS = {
  distributors: { titulo: "Distribuidores", Componente: DistribuidorMenu },
  customer: { titulo: "Clientes", Componente: ClientMenu },
  devices: { titulo: "Dispositivos", Componente: DevicesMenu },
  geolocation: { titulo: "Geolocalización", Componente: GeolocatorMenu },
  communication: { titulo: "Comunicación", Componente: CommunicationMenu },
};

function AdminMenu() {
  const dispatch = useDispatch();

  const usuarioIniciado = useSelector((state) => state.auth.user);

  // NUEVA RUTA CORRECTA
  const clientsPage = useSelector((state) => state.clients.data);
  const distribuidoresPage = useSelector(
    (state) => state.distribuidores.allDistribuidores
  );

  const clientsRows = clientsPage?.rows || [];
  const distribuidoresRows = distribuidoresPage?.rows || [];

  // Gestor de ventanas: cada menú se abre en su propia ventana (se pueden
  // tener varias abiertas, mover, minimizar, maximizar y cerrar).
  const [ventanas, setVentanas] = useState([]); // [{ id, titulo, minimizada, maximizada, z }]
  const [idEnfocada, setIdEnfocada] = useState(null);
  const zTop = React.useRef(100);

  const traerAlFrente = (id) => {
    zTop.current += 1;
    const z = zTop.current;
    setIdEnfocada(id);
    setVentanas((vs) => vs.map((v) => (v.id === id ? { ...v, z } : v)));
  };

  const abrirVentana = (id) => {
    zTop.current += 1;
    const z = zTop.current;
    setIdEnfocada(id);
    setVentanas((vs) =>
      vs.some((v) => v.id === id)
        ? vs.map((v) => (v.id === id ? { ...v, minimizada: false, z } : v))
        : [...vs, { id, minimizada: false, maximizada: false, z }]
    );
  };
  const cambiar = (id, cambios) =>
    setVentanas((vs) => vs.map((v) => (v.id === id ? { ...v, ...cambios } : v)));
  const cerrarVentana = (id) => setVentanas((vs) => vs.filter((v) => v.id !== id));
  const clickDock = (id) => {
    const v = ventanas.find((x) => x.id === id);
    if (!v) return;
    if (v.minimizada) abrirVentana(id);
    else if (idEnfocada === id) cambiar(id, { minimizada: true });
    else traerAlFrente(id);
  };
  const [openSearch, setOpenSearch] = useState(false);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [carteraDistribuidor, setCarteraDistribuidor] = useState(null);

  // La sesión la restaura <AuthGuard> en app/admin/layout.js.

  // 🔥 Cargar clientes + distribuidores cuando se abre el buscador
  useEffect(() => {
    if (!openSearch) return;

    if (!clientsRows || clientsRows.length === 0) {
      dispatch(fetchClients({ page: 0, pageSize: 10000 })); // <- esto ya lo tenés
    }

    if (distribuidoresRows.length === 0) {
      dispatch(getDistribuidores({ page: 0, pageSize: 10000 }));
    }
  }, [openSearch, dispatch]);

  // 🔵 Unificar clientes + distribuidores para búsqueda
  const combined = useMemo(() => {
    const mClients = clientsRows.map((c) => ({
      type: "cliente",
      id: c.idClientes || c.id,
      name: c.RazonSocial || c.Nombre || c.NombreCompleto || "",
      codigo: c.CodigoCliente || c.codigo || "",
      localidad: c.Localidad || "",
      email: c.Email || c.CorreoElectronico || "",
      codigoDumont: c.CodigoDumont || "",
      raw: c,
    }));

    const mDistribs = distribuidoresRows.map((d) => ({
      type: "distribuidor",
      id: d.idDistribuidor || d.id,
      name: d.NombreComercial || d.RazonSocial || "",
      codigo: d.CodigoDistribuidor || d.codigo || "",
      localidad: d.Localidad || "",
      email: d.Email || d.CorreoElectronico || "",
      raw: d,
    }));

    return [...mClients, ...mDistribs];
  }, [clientsRows, distribuidoresRows]);

  // 🔍 Buscador
  const results = useMemo(() => {
    const q = search.toLowerCase();

    return combined.filter((item) => {
      return (
        (item.nombre?.toLowerCase() || "").includes(q) ||
        (item.localidad?.toLowerCase() || "").includes(q) ||
        (item.email?.toLowerCase() || "").includes(q) ||
        (item.codigoDumont?.toLowerCase() || "").includes(q)
      );
    });
  }, [search, combined]);

  // Atajos del teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpenSearch(true);
        setSearch("");
      }
      if (e.key === "Escape") {
        setOpenSearch(false);
        setSearch("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSelect(item) {
    setSelected(item);
    setOpenSearch(false);
    setSearch("");
  }

  return (
    <div
      className="w-full h-screen p-4 flex flex-col items-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/path/to/your/background-image.jpg')",
      }}>
      {/* NAV SUPERIOR */}
      <div className="w-full max-w-sm flex items-center justify-between bg-[#F2F5F6] p-2 rounded-full shadow-md backdrop-blur-md">
        <ul className="flex flex-wrap gap-4 justify-center">
          {/* Distribuidores */}
          <li
            className="relative flex flex-col items-center cursor-pointer group"
            onClick={() => abrirVentana("distributors")}>
            <div className="flex items-center justify-center w-[40px] h-[40px] p-2 bg-white rounded-full text-2xl">
              <Image
                src="/svg/distributorsMenu.svg"
                alt="Devices"
                width={30}
                height={30}
              />
            </div>
            <span className="absolute top-12 text-sm bg-white p-1 rounded-md shadow-md opacity-0 group-hover:opacity-100">
              Distribuidores
            </span>
          </li>

          {/* Clientes */}
          <li
            className="relative flex flex-col items-center cursor-pointer group"
            onClick={() => abrirVentana("customer")}>
            <div className="flex items-center justify-center w-[40px] h-[40px] p-2 bg-white rounded-full text-2xl">
              <Image
                src="/svg/clientMenu.svg"
                alt="Devices"
                width={30}
                height={30}
              />
            </div>
            <span className="absolute top-12 text-sm bg-white p-1 rounded-md shadow-md opacity-0 group-hover:opacity-100">
              Clientes
            </span>
          </li>

          {/* Dispositivos */}
          <li
            className="relative flex flex-col items-center cursor-pointer group"
            onClick={() => abrirVentana("devices")}>
            <div className="flex items-center justify-center w-[40px] h-[40px] p-2 bg-white rounded-full">
              <Image
                src="/svg/devicesMenu.svg"
                alt="Devices"
                width={30}
                height={30}
              />
            </div>
            <span className="absolute top-12 text-sm bg-white p-1 rounded-md shadow-md opacity-0 group-hover:opacity-100">
              Dispositivos
            </span>
          </li>

          {/* Geolocalización */}
          <li
            className="relative flex flex-col items-center cursor-pointer group"
            onClick={() => abrirVentana("geolocation")}>
            <div className="flex items-center justify-center w-[40px] h-[40px] p-2 bg-white rounded-full">
              <Image
                src="/svg/geolocationMenu.svg"
                alt="Geo"
                width={30}
                height={30}
              />
            </div>
            <span className="absolute top-12 text-sm bg-white p-1 rounded-md shadow-md opacity-0 group-hover:opacity-100">
              Geolocalización
            </span>
          </li>

          {/* Comunicación */}
          <li
            className="relative flex flex-col items-center cursor-pointer group"
            onClick={() => abrirVentana("communication")}>
            <div className="flex items-center justify-center w-[40px] h-[40px] p-2 bg-white rounded-full">
              <Image
                src="/svg/communicationMenu.svg"
                alt="Comm"
                width={30}
                height={30}
              />
            </div>
            <span className="absolute top-12 text-sm bg-white p-1 rounded-md shadow-md opacity-0 group-hover:opacity-100">
              Comunicación
            </span>
          </li>
        </ul>

        {/* SEARCH BUTTON */}
        <button
          className="p-2 ml-3 rounded-full hover:bg-gray-200 transition"
          onClick={() => {
            setOpenSearch(true);
            setSearch("");
          }}>
          <Search size={22} />
        </button>
      </div>

      {/* SEARCH MODAL */}
      {openSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg w-[520px] shadow-xl">
            <input
              className="w-full p-3 border rounded mb-4"
              placeholder="Buscar por nombre, código, localidad, email..."
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="max-h-[320px] overflow-y-auto divide-y">
              {results.length === 0 ? (
                <p className="text-gray-500 p-3">Sin resultados</p>
              ) : (
                results.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelect(item)}
                    className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between items-start">
                    <div>
                      <div className="font-semibold">
                        {item.type === "cliente" ? "🏪 " : "🚚 "}
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Código: {item.codigo || "—"} •{" "}
                        {item.localidad || "Sin localidad"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.email || ""}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => {
                setOpenSearch(false);
                setSearch("");
              }}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {selected && (
        <ProfileModal
          data={selected}
          onClose={() => setSelected(null)}
          onOpenCartera={(distRaw) => {
            setCarteraDistribuidor(distRaw.raw || distRaw);
            setSelected(null);
          }}
        />
      )}

      {/* CARTERA MODAL */}
      {carteraDistribuidor && (
        <CarteraModal
          distribuidor={carteraDistribuidor}
          clientesAll={clientsRows} // <--- pasamos todos los clientes
          onClose={() => setCarteraDistribuidor(null)}
        />
      )}

      {/* VENTANAS */}
      {ventanas.map((v, i) => {
        const def = MENUS[v.id];
        return (
          <VentanaSO
            key={v.id}
            titulo={def.titulo}
            indice={i}
            minimizada={v.minimizada}
            maximizada={v.maximizada}
            z={v.z}
            enfocada={idEnfocada === v.id}
            onEnfocar={() => idEnfocada !== v.id && traerAlFrente(v.id)}
            onMinimizar={() => cambiar(v.id, { minimizada: true })}
            onMaximizar={() => cambiar(v.id, { maximizada: !v.maximizada })}
            onCerrar={() => cerrarVentana(v.id)}>
            <def.Componente />
          </VentanaSO>
        );
      })}
      <DockVentanas
        ventanas={ventanas.map((v) => ({ ...v, titulo: MENUS[v.id].titulo }))}
        idEnfocada={idEnfocada}
        onClick={clickDock}
      />
    </div>
  );
}

export default AdminMenu;
