<<<<<<< HEAD
'use client'
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";


function AdminMenu() {
  const usuarioIniciado = useSelector((state) => state.auth.user);
console.log('user:', usuarioIniciado)
=======
'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

function AdminMenu() {
  const usuarioIniciado = useSelector((state) => state.auth.user);
  console.log('user:', usuarioIniciado);
>>>>>>> main
  return (
    <div className=" w-full p-6 flex items-center justify-center">
      <ul
        className="w-[60rem] h-[50rem] p-4  text-black 
        flex flex-row flex-wrap items-center justify-center gap-10"
      >
<<<<<<< HEAD
        <Link href={"/admin/userRegistration"}>
          <li
            className=" w-[19rem] h-[23rem] rounded-lg bg-white  p-4 flex flex-col justify-center items-center gap-2 font-semibold cursor-pointer
        shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:scale-110 transition-all duration-200 "
          >
            <Image
              width={250}
              height={250}
              src={"/svg/userRegister.svg"}
              alt="DuMont Logo"
              className="rounded-lg"
            />

            <h>Registro Usuario</h>
          </li>
        </Link>

        <li
          className=" w-[19rem] h-[23rem] rounded-lg bg-white p-4 flex flex-col justify-center items-center gap-2 font-semibold cursor-pointer
        shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:scale-110 transition-all duration-200 "
        >
          <Image
            width={250}
            height={250}
            src={"/svg/deviceRegister.svg"}
            alt="DuMont Logo"
            className="rounded-lg"
          />

          <h3>Registro Dispositivos</h3>
        </li>
        <Link href={"/admin/customerRegistration"}>
=======
        <Link href={'/admin/customerMenu'}>
>>>>>>> main
          <li
            className=" w-[19rem] h-[23rem] rounded-lg bg-white p-4 flex flex-col justify-center items-center gap-2 font-semibold cursor-pointer
        shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:scale-110 transition-all duration-200 "
          >
            <Image
              width={250}
              height={250}
<<<<<<< HEAD
              src={"/svg/customerMenu.svg"}
=======
              src={'/svg/customerMenu.svg'}
>>>>>>> main
              alt="DuMont Logo"
              className="rounded-lg"
            />

            <h3>Menú Clientes </h3>
          </li>
        </Link>

<<<<<<< HEAD
        <Link href={"/admin/userMenu"}>
=======
        <Link href={'/admin/userMenu'}>
>>>>>>> main
          <li
            className=" w-[19rem] h-[23rem] rounded-lg bg-white p-4 flex flex-col justify-center items-center gap-2 font-semibold cursor-pointer
        shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:scale-110 transition-all duration-200 "
          >
            <Image
              width={250}
              height={250}
<<<<<<< HEAD
              src={"/svg/usermenu.svg"}
=======
              src={'/svg/usermenu.svg'}
>>>>>>> main
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
