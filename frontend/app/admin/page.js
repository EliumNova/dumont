'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserMenu from './userMenu/page.js';
import ClientMenu from './clientMenu/page.js';
import DevicesMenu from './devicesMenu/page.js';
import CommunicationMenu from './communicationMenu/page.js';
import DistribuidorMenu from './distributorMenu/page.js';
import GeolocatorMenu from './geolocatorMenu/page.js';
import { initializeAuth } from '@/lib/slices/authAction'; // Importa la acción de inicialización

function AdminMenu() {
  const dispatch = useDispatch();
  const usuarioIniciado = useSelector((state) => state.auth.user);
  const [activeMenu, setActiveMenu] = useState(null);

  // Inicializar la autenticación al cargar el componente
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <div
      className="w-full h-screen p-4 flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/path/to/your/background-image.jpg')",
      }}
    >
      {/* Barra de iconos */}
      <div className="w-full max-w-sm flex flex-wrap items-center justify-center bg-[#F2F5F6] p-2 rounded-full shadow-md backdrop-blur-md">
        <ul className="flex flex-wrap gap-4 justify-center">
          {/* Botones del menú */}
          {[
            {
              name: 'Distribuidores',
              icon: '/svg/distributorsMenu.svg',
              id: 'distributors',
            },
            { name: 'Clientes', icon: '/svg/clientMenu.svg', id: 'customer' },
            {
              name: 'Dispositivos',
              icon: '/svg/devicesMenu.svg',
              id: 'devices',
            },
            {
              name: 'Geolocalización',
              icon: '/svg/geolocationMenu.svg',
              id: 'geolocation',
            },
            {
              name: 'Comunicación',
              icon: '/svg/communicationMenu.svg',
              id: 'communication',
            },
          ].map((menu) => (
            <li
              key={menu.id}
              className="relative flex flex-col items-center cursor-pointer group"
              onClick={() => setActiveMenu(menu.id)}
            >
              {/* Ícono */}
              <div className="flex items-center justify-center w-[40px] h-[40px] p-2 hover:scale-105 transition-all duration-200 bg-white rounded-full">
                <Image width={30} height={30} src={menu.icon} alt={menu.name} />
              </div>

              {/* Nombre fuera del menú (visible con hover) */}
              <span className="absolute top-12 text-sm text-[#191920] bg-white p-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {menu.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Ventana modal */}
      {activeMenu && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pt-5">
          {/* Fondo blurreado */}
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm pt-10"></div>

          {/* Contenido del modal */}
          <div className="relative w-auto max-w-[90vw] md:max-w-[95vw] lg:max-w-[98vw] bg-white rounded-md shadow-lg p-6 z-10 mt-10">
            {/* Botón de cerrar */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={() => setActiveMenu(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Contenido dinámico del modal */}
            <div className="overflow-y-auto">
              {activeMenu === 'customer' && <ClientMenu />}
              {activeMenu === 'devices' && <DevicesMenu />}
              {activeMenu === 'communication' && <CommunicationMenu />}
              {activeMenu === 'distributors' && <DistribuidorMenu />}
              {activeMenu === 'geolocation' && <GeolocatorMenu />}
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal si no hay menú activo */}
      {!activeMenu && (
        <div className="opacity-0 flex flex-col items-center justify-center w-full max-w-4xl h-full p-10 shadow-lg rounded-sm mt-4 backdrop-blur-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Panel de Administración
          </h1>
          <p className="text-center text-gray-600">
            Selecciona una opción del menú superior para comenzar a administrar
            el sistema.
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminMenu;
