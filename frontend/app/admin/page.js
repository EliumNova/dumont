'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

function AdminMenu() {
  const usuarioIniciado = useSelector((state) => state.auth.user);
  console.log('user:', usuarioIniciado);
  return (
    <div className="w-full p-6 flex items-center justify-center ">
      <ul className="flex flex-wrap items-center justify-center gap-x-56 gap-y-10 w-full max-w-[60rem] p-4 text-black">
        <Link href={'/admin/customerMenu'}>
          <li className="hover:scale-110 transition-all duration-200">
            <div className="w-[12rem] h-[12rem] rounded-lg bg-[#12141DD9] p-4 flex flex-col justify-center items-center gap-2 font-semibold cursor-pointer shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
              <Image
                width={100}
                height={100}
                src={'/svg/clientMenu.svg'}
                alt="Clientes"
                className="rounded-lg"
              />
            </div>
            <div></div>
            <h3 className="text-center text-white">Clientes</h3>
          </li>
        </Link>

        <Link href={'/admin/userMenu'}>
          <li className="hover:scale-110 transition-all duration-200">
            <div className="w-[12rem] h-[12rem] rounded-lg bg-[#12141DD9] p-4 flex flex-col justify-center items-center gap-2 font-semibold cursor-pointer shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
              <Image
                width={100}
                height={100}
                src={'/svg/userMenu.svg'}
                alt="Usuarios"
                className="rounded-lg"
              />
            </div>
            <h3 className="text-center text-white">Usuarios</h3>
          </li>
        </Link>

        <Link href={'/admin/devicesMenu'}>
          <li className="hover:scale-110 transition-all duration-200">
            <div className="w-[12rem] h-[12rem] rounded-lg bg-[#12141DD9] p-4 flex flex-col justify-center items-center gap-2 font-semibold cursor-pointer shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
              <Image
                width={100}
                height={100}
                src={'/svg/devicesMenu.svg'}
                alt="Dispositivos"
                className="rounded-lg"
              />
            </div>
            <h3 className="text-center text-white">Dispositivos</h3>
          </li>
        </Link>

        <Link href={'/admin/communicationMenu'}>
          <li className="hover:scale-110 transition-all duration-200">
            <div className="w-[12rem] h-[12rem] rounded-lg bg-[#12141DD9] p-4 flex flex-col justify-center items-center gap-2 font-semibold cursor-pointer shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
              <Image
                width={100}
                height={100}
                src={'/svg/communicationMenu.svg'}
                alt="Comunicación"
                className="rounded-lg"
              />
            </div>
            <h3 className="text-center text-white">Comunicación</h3>
          </li>
        </Link>
      </ul>
    </div>
  );
}

export default AdminMenu;
