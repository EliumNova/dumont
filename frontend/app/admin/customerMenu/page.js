'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { TbUserEdit, TbPlus } from 'react-icons/tb';
import { IoIosArrowForward } from 'react-icons/io';
import Link from 'next/link';

function CustomerMenu() {
  const [user, setUsers] = useState([
    {
      name: 'Heineken',
      photo: '/svg/Heineken_logo.svg',
      clients: [],
    },
    {
      name: 'Brahma',
      photo: '/svg/Logo-cerveza-brahma.svg',
      clients: [],
    },
    {
      name: 'Manaos',
      photo: '/svg/Manaos_logo.svg',
      clients: [],
    },
    {
      name: 'Arcor',
      photo: '/svg/Arcor_logo.svg',
      clients: [],
    },
    {
      name: 'Nestle',
      photo: '/svg/Nestle_textlogo_blue.svg',
      clients: [],
    },
  ]);

  return (
    <div
      className=" flex flex-col gap-12 md:justify-center 
    items-center h-[100%] w-3/4 p-12 m-auto"
    >
      <input
        type="text"
        name="search"
        placeholder="Buscar"
        className="bg-white rounded-md p-6 shadow-lg  w-3/4"
        autoComplete="off"
      ></input>

      <ul className="flex flex-row gap-4 justify-center">
        {user.map((user, index) => (
          <li
            className="flex flex-col gap-2 justify-center items-center mx-auto
        p-4 w-52 h-72 hover:scale-110 transition-all duration-150"
            key={index}
          >
            <div className="w-[150px] h-[150px] rounded-full overflow-hidden flex justify-center items-center">
              <Image
                width={150}
                height={150}
                src={user.photo}
                alt={'user avatar profile'}
                className="object-cover"
              />
            </div>

            <h3 className="font-bold text-xs text-white">{user.name}</h3>

            <TbUserEdit
              className="text-text-icon cursor-pointer w-10 h-10 left-3 relative"
              onClick={() => console.log('1')}
            />
          </li>
        ))}

        <li className="flex items-center justify-center ">
          <Link href={'/admin/customerRegistration'}>
            <button className="rounded-full bg-principal text-white font-bold text-2xl w-12 h-12 flex justify-center items-center hover:scale-125 transition-all duration-300">
              <TbPlus className="text-[1.25rem]" />
            </button>
          </Link>
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
