<<<<<<< HEAD
import Image from "next/image";
import React from "react";
import { TbUserEdit } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";


function UserMenu() {
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
        <li
          className="flex flex-col gap-2 justify-center items-center mx-auto
        p-4 w-52 h-72 hover:scale-110 transition-all duration-150"
        >
          <div>
            <Image
              width={200}
              height={200}
              src={"/UserIcon1.jpeg"}
              alt={"user avatar profile"}
              className="rounded-full"
            />
          </div>

          <h3 className="font-bold text-xl">Jacob Jones</h3>

          <TbUserEdit className="text-text-icon cursor-pointer w-10 h-10 left-3 relative" />
        </li>
        <li
          className="flex flex-col gap-2 justify-center items-center mx-auto
        p-4 w-52 h-72 hover:scale-110 transition-all duration-150"
        >
          <div>
            <Image
              width={200}
              height={200}
              src={"/UserIcon2.jpeg"}
              alt={"user avatar profile"}
              className="rounded-full"
            />
          </div>

          <h3 className="font-bold text-xl">Jacob Jones</h3>

          <TbUserEdit className="text-text-icon cursor-pointer w-10 h-10 left-3 relative" />
        </li>
        <li
          className="flex flex-col gap-2 justify-center items-center mx-auto
        p-4 w-52 h-72 hover:scale-110 transition-all duration-150"
        >
          <div>
            <Image
              width={200}
              height={200}
              src={"/UserIcon3.jpeg"}
              alt={"user avatar profile"}
              className="rounded-full"
            />
          </div>

          <h3 className="font-bold text-xl">Jacob Jones</h3>

          <TbUserEdit className="text-text-icon cursor-pointer w-10 h-10 left-3 relative" />
        </li>
        <li
          className="flex flex-col gap-2 justify-center items-center mx-auto
        p-4 w-52 h-72 hover:scale-110 transition-all duration-150"
        >
          <div>
            <Image
              width={200}
              height={200}
              src={"/UserIcon4.jpeg"}
              alt={"user avatar profile"}
              className="rounded-full"
            />
          </div>

          <h3 className="font-bold text-xl">Jacob Jones</h3>

          <TbUserEdit className="text-text-icon cursor-pointer w-10 h-10 left-3 relative" />
        </li>

        <li
          className="flex flex-col gap-2 justify-center items-center mx-auto
        p-4 w-52 h-72 hover:scale-110 transition-all duration-150"
        >
          <div>
            <Image
              width={200}
              height={200}
              src={"/UserIcon5.jpeg"}
              alt={"user avatar profile"}
              className="rounded-full"
            />
          </div>

          <h3 className="font-bold text-xl">Jacob Jones</h3>

          <TbUserEdit className="text-text-icon cursor-pointer w-10 h-10 left-3 relative" />
        </li>
       
      </ul>

      <div className="flex flex-row justify-center items-center text-text-icon">
      <IoIosArrowForward className="rotate-180 h-8 w-8 m-0 cursor-pointer transition-all duration-150 hover:scale-110  " />
      <p className="text-text-icon text-xl font-bold">0 - 5</p>
      <IoIosArrowForward className=" h-8 w-8 m-0 cursor-pointer transition-all duration-150 hover:scale-110  " />
=======
import Table from "./Componentes/Table";

function CustomerMenu() {


  return (
    <div className="" >

      <h3 className="text-3xl font-bold ">Jacob Jall</h3>

      <div className="flex flex-col justify-center items-center ">
      <Table />
>>>>>>> main
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default UserMenu;
=======
export default CustomerMenu;
>>>>>>> main
