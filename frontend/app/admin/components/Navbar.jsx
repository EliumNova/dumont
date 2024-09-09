"use client";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";

function Navbar() {
  // Obtener la ruta actual
  const pathname = usePathname();
  console.log("ruta: ", pathname);

  // Verificar si la ruta es exactamente "/admin"
  let isAdminRoot = pathname === "/admin";

  // Verificar si la ruta comienza con "/admin/" (y no es exactamente "/admin")
  let isAdminSubroute = pathname.startsWith("/admin/");

  // Ejemplo de ruta específica "/admin/userRegistration"
  let userRegisterUrl = pathname === "/admin/userRegistration";
  return (
    <div
      className={`z-40 text-black flex flex-row justify-between px-8 p-4 shadow-black shadow-2xl  border-b-2  border
    ${isAdminSubroute ? "bg-fondo  " : "bg-white"}
    `}
    >
      <div className="flex flex-row gap-4 justify-center items-center  ">
        {isAdminSubroute && (<Link href={"/admin"}>
          <IoIosArrowForward className="rotate-180 h-10 w-12 m-0 cursor-pointer transition-all duration-150 hover:scale-110  " />
          </Link>)}
        <Image
          width={50}
          height={50}
          src={"/DuMontLogo.jpeg"}
          alt="DuMont Logo"
          className="rounded-lg w-10 md:w-14 transition-all duration-150"
        />

        {userRegisterUrl && (
          <h2 className="font-bold text-base md:text-xl  transition-all duration-150">
            Registro de Usuarios
          </h2>
        )}
        {isAdminRoot && (
          <h2 className="font-bold text-base md:text-xl  transition-all duration-150">
            Menú Administrador
          </h2>
        )}
      </div>
      <div className="flex flex-row gap-3">
        <div>
          <p className="text-lg  font-semibold  text-end">Jerome Bell</p>
          <p className="text-xs text-[#353344] opacity-60 text-end">
            jeromebell@gmail.com
          </p>
        </div>
        <Image
          width={50}
          height={50}
          src={"/UserIcon5.jpeg"}
          alt="Perfil Image"
          className="rounded-full"
        />
      </div>
    </div>
  );
}

export default Navbar;
