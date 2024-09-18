"use client";
import Image from "next/image";
import React, { useState } from "react";
import { TbUserEdit } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";

function CustomerMenu() {
  const [user, setUsers] = useState([
    {
      name: "Jacob Jones",
      photo: "/UserIcon1.jpeg",
      clients: [],
    },
    {
      name: "Maria Jones",
      photo: "/UserIcon2.jpeg",
      clients: [],
    },
    {
      name: "Pamela Jones",
      photo: "/UserIcon3.jpeg",
      clients: [],
    },
    {
      name: "Roberta Jones",
      photo: "/UserIcon4.jpeg",
      clients: [],
    },
    {
      name: "Carlos Jones",
      photo: "/UserIcon5.jpeg",
      clients: [],
    },
  ]);

  return (
    <div
      className=" flex flex-col gap-12 md:justify-center 
    items-center h-[100%] w-3/4 p-12 m-auto flex-wrap "
    >
      <input
        type="text"
        name="search"
        placeholder="Buscar"
        className="bg-white rounded-md p-6 shadow-lg  w-3/4"
        autoComplete="off"
      ></input>

      <ul className="flex flex-row gap-4 flex-wrap">
        {user.map((user, index) => (
          <li
            className="flex flex-col gap-2 justify-center items-center mx-auto
        p-4 w-52 h-72 hover:scale-110 transition-all duration-150"
            key={index}
          >
            <div>
              <Image
                width={200}
                height={200}
                src={user.photo}
                alt={"user avatar profile"}
                className="rounded-full"
              />
            </div>

            <h3 className="font-bold text-xl">{user.name}</h3>

            <TbUserEdit className="text-text-icon cursor-pointer w-10 h-10 left-3 relative" />
          </li>
        ))}
        
        <li className=" flex items-start justify-start mt-14 ml-5">
         <Link  href={"/admin/customerRegistration"}>
         <button className="rounded-full bg-principal text-white font-bold text-3xl w-20 h-20 hover:scale-125 transition-all duration-300" >
            +
          </button></Link>
        </li>
      </ul>

      <div className="flex flex-row justify-center items-center text-text-icon">
        <IoIosArrowForward className="rotate-180 h-8 w-8 m-0 cursor-pointer transition-all duration-150 hover:scale-110  " />
        <p className="text-text-icon text-xl font-bold">0 - 5</p>
        <IoIosArrowForward className=" h-8 w-8 m-0 cursor-pointer transition-all duration-150 hover:scale-110  " />
      </div>
    </div>
  );
}

export default CustomerMenu;
