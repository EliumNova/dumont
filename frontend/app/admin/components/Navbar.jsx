'use client';
import Image from 'next/image';
import React from 'react';
import { usePathname } from 'next/navigation';
import { IoIosArrowForward } from 'react-icons/io';
import Link from 'next/link';

function Navbar() {
  const pathname = usePathname();
  console.log('ruta: ', pathname);

  let isAdminRoot = pathname === '/admin';
  let isAdminSubroute = pathname.startsWith('/admin/');
  let userRegisterUrl = pathname === '/admin/userRegistration';
  let customerRegisterUrl = pathname === '/admin/customerRegistration';
  let customerMenu = pathname === '/admin/customerMenu';
  let distribuitorMenu = pathname === '/admin/customerMenu/distribuitorMenu';
  let userMenu = pathname === '/admin/userMenu';
  let devicesMenu = pathname === '/admin/devicesMenu';

  const getBackUrl = () => {
    if (distribuitorMenu) return '/admin/customerMenu';
    if (customerRegisterUrl) return '/admin/customerMenu';
    return '/admin';
  };

  return (
    <div
      className={`z-40 text-white flex flex-col md:flex-row justify-between px-4 md:px-8 p-3 shadow-[#35334426] shadow-sm border-b-2 border-[#12141D]
      ${isAdminSubroute ? 'bg-[#12141D]' : 'bg-[#12141D]'}`}
    >
      <div className="flex flex-row gap-2 md:gap-4 justify-center items-center">
        {isAdminSubroute && (
          <Link href={getBackUrl()}>
            <IoIosArrowForward className="rotate-180 h-8 w-10 cursor-pointer transition-all duration-150 hover:scale-110" />
          </Link>
        )}

        {/* <Image
          width={40}
          height={40}
          src={"/DuMontLogo.jpeg"}
          alt="DuMont Logo"
          className="rounded-lg w-8 md:w-10 transition-all duration-150"
        /> */}

        {userRegisterUrl && (
          <h2 className="font-bold text-sm md:text-base transition-all duration-150">
            Registro de Usuarios
          </h2>
        )}
        {isAdminRoot && (
          <h2 className="font-bold text-sm md:text-base transition-all duration-150">
            Menú Administrador
          </h2>
        )}
        {customerMenu && (
          <h2 className="font-bold text-sm md:text-base transition-all duration-150">
            Menú Clientes
          </h2>
        )}
        {distribuitorMenu && (
          <h2 className="font-bold text-sm md:text-base transition-all duration-150">
            Lista Distribuidores
          </h2>
        )}
        {userMenu && (
          <h2 className="font-bold text-sm md:text-base transition-all duration-150">
            Menú de Usuarios
          </h2>
        )}
        {devicesMenu && (
          <h2 className="font-bold text-sm md:text-base transition-all duration-150">
            Menú de Dispositivos
          </h2>
        )}
      </div>
      <div className="flex flex-row gap-2 md:gap-3 mt-2 md:mt-0">
        <div className="text-right">
          <p className="text-xs md:text-base font-semibold">Jerome Bell</p>
          <p className="text-xs text-white opacity-60">jeromebell@gmail.com</p>
        </div>
        <Image
          width={40}
          height={40}
          src={'/UserIcon5.jpeg'}
          alt="Perfil Image"
          className="rounded-full"
        />
      </div>
    </div>
  );
}

export default Navbar;
