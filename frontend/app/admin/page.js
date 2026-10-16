"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

import ClientMenu from "./clientMenu/page.js";
import DevicesMenu from "./devicesMenu/page.js";
import CommunicationMenu from "./communicationMenu/page.js";
import DistribuidorMenu from "./distributorMenu/page.js";
import GeolocatorMenu from "./geolocatorMenu/page.js";

import { Search } from "lucide-react";

import VentanaSO, { DockVentanas } from "./components/VentanaSO";
import BuscadorSO from "./components/BuscadorSO";

import axios from "axios";

const MENUS = {
  distributors: { titulo: "Distribuidores", Componente: DistribuidorMenu },
  customer: { titulo: "Clientes", Componente: ClientMenu },
  devices: { titulo: "Dispositivos", Componente: DevicesMenu },
  geolocation: { titulo: "Geolocalización", Componente: GeolocatorMenu },
  communication: { titulo: "Comunicación", Componente: CommunicationMenu },
};

function AdminMenu() {
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


  // La sesión la restaura <AuthGuard> en app/admin/layout.js.

  // Listas COMPLETAS para el buscador. Se piden al abrirlo (así están al día) y
  // no se comparten con las tablas de Redux, que solo guardan la página actual.
  const [todosClientes, setTodosClientes] = useState([]);
  const [todosDistribuidores, setTodosDistribuidores] = useState([]);
  useEffect(() => {
    if (!openSearch) return;
    const base = process.env.NEXT_PUBLIC_API_URL;
    axios
      .get(`${base}/api/clientes`, { params: { page: 0, pageSize: 10000 } })
      .then((r) => setTodosClientes(r.data?.rows || []))
      .catch((e) => console.error("Buscador (clientes):", e));
    axios
      .get(`${base}/api/distribuidores`, { params: { page: 0, pageSize: 10000 } })
      .then((r) => setTodosDistribuidores(r.data?.rows || []))
      .catch((e) => console.error("Buscador (distribuidores):", e));
  }, [openSearch]);

  // Atajos del teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpenSearch(true);
      }
      if (e.key === "Escape") {
        setOpenSearch(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className="w-full h-full p-3 sm:p-4 flex flex-col items-center bg-cover bg-center"
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
          }}>
          <Search size={22} />
        </button>
      </div>

      {/* BUSCADOR (ventana con navegación buscar → perfil → cartera) */}
      <BuscadorSO
        isOpen={openSearch}
        onClose={() => setOpenSearch(false)}
        clientes={todosClientes}
        distribuidores={todosDistribuidores}
      />

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
