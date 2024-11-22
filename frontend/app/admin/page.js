'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

function AdminMenu() {
  const usuarioIniciado = useSelector((state) => state.auth.user);
  console.log('user:', usuarioIniciado);

  return (
    <div
      className="w-full h-full p-4 flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/path/to/your/background-image.jpg')", // Reemplaza con la ruta de tu imagen
      }}
    >
      {/* Barra de iconos en la parte superior */}
      <div className="w-auto flex items-center justify-center bg-[#F2F5F6] p-2 pr-4 pl-4 rounded-sm shadow-md backdrop-blur-md">
        <ul className="flex gap-8">
          <Link href={'/admin/customerMenu'}>
            <li className="flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-center w-[50px] h-[50px]">
                <Image
                  width={35}
                  height={35}
                  src={'/svg/clientMenu.svg'}
                  alt="Clientes"
                  className="rounded-sm"
                />
              </div>
              <h3 className="text-center text-[#191920] text-sm mt-2">
                Clientes
              </h3>
            </li>
          </Link>

          <Link href={'/admin/userMenu'}>
            <li className="flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-center w-[50px] h-[50px]">
                <Image
                  width={35}
                  height={35}
                  src={'/svg/userMenu.svg'}
                  alt="Usuarios"
                  className="rounded-sm"
                />
              </div>
              <h3 className="text-center text-[#191920] text-sm mt-2">
                Usuarios
              </h3>
            </li>
          </Link>

          <Link href={'/admin/devicesMenu'}>
            <li className="flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-center w-[50px] h-[50px]">
                <Image
                  width={35}
                  height={35}
                  src={'/svg/devicesMenu.svg'}
                  alt="Dispositivos"
                  className="rounded-sm"
                />
              </div>
              <h3 className="text-center text-[#191920] text-sm mt-2">
                Dispositivos
              </h3>
            </li>
          </Link>

          <Link href={'/admin/communicationMenu'}>
            <li className="flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-center w-[50px] h-[50px]">
                <Image
                  width={35}
                  height={35}
                  src={'/svg/communicationMenu.svg'}
                  alt="Comunicación"
                  className="rounded-sm"
                />
              </div>
              <h3 className="text-center text-[#191920] text-sm mt-2">
                Comunicación
              </h3>
            </li>
          </Link>

          <Link href={'/admin/communicationMenu'}>
            <li className="flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-center w-[50px] h-[50px]">
                <Image
                  width={35}
                  height={35}
                  src={'/svg/distributorsMenu.svg'}
                  alt="Distribuidores"
                  className="rounded-sm"
                />
              </div>
              <h3 className="text-center text-[#191920] text-sm mt-2">
                Distribuidores
              </h3>
            </li>
          </Link>

          <Link href={'/admin/communicationMenu'}>
            <li className="flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-center w-[50px] h-[50px]">
                <Image
                  width={35}
                  height={35}
                  src={'/svg/geolocationMenu.svg'}
                  alt="Geolocalización"
                  className="rounded-sm"
                />
              </div>
              <h3 className="text-center text-[#191920] text-sm mt-2">
                Geolocalización
              </h3>
            </li>
          </Link>
        </ul>
      </div>

      {/* Contenido principal en el centro de la pantalla */}
      <div className="opacity-0 flex flex-col items-center justify-center w-full max-w-4xl h-full p-10 shadow-lg rounded-sm mt-4 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Panel de Administración
        </h1>
        <p className="text-center text-gray-600">
          Selecciona una opción del menú superior para comenzar a administrar el
          sistema.
        </p>
      </div>
    </div>
  );
}

export default AdminMenu;
