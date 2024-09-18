"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

function AdminMenu() {
  const usuarioIniciado = useSelector((state) => state.auth.user);
  console.log("user:", usuarioIniciado);
  return (
    <div className=" w-full p-6 flex items-center justify-center">
      <ul
        className="w-[60rem] h-[50rem] p-4  text-black 
        flex flex-row flex-wrap items-center justify-center gap-10"
      >
   
        <Link href={"/admin/customerMenu"}>
          <li
            className=" w-[19rem] h-[23rem] rounded-lg bg-white p-4 flex flex-col justify-center items-center gap-2 font-semibold cursor-pointer
        shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:scale-110 transition-all duration-200 "
          >
            <Image
              width={250}
              height={250}
              src={"/svg/customerMenu.svg"}
              alt="DuMont Logo"
              className="rounded-lg"
            />

            <h3>Menú Clientes </h3>
          </li>
        </Link>

        <Link href={"/admin/userMenu"}>
          <li
            className=" w-[19rem] h-[23rem] rounded-lg bg-white p-4 flex flex-col justify-center items-center gap-2 font-semibold cursor-pointer
        shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:scale-110 transition-all duration-200 "
          >
            <Image
              width={250}
              height={250}
              src={"/svg/usermenu.svg"}
              alt="DuMont Logo"
              className="rounded-lg"
            />

            <h3>Menú Usuarios</h3>
          </li>
        </Link>
      </ul>
    </div>
  );
}

export default AdminMenu;
