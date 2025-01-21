'use client';
import { useState } from 'react';
import Table from './components/Table';
import NewDevice from './components/NewDevice';
import ModalWindow from '../components/ModalWindow';
import Image from 'next/image';
import Link from 'next/link';

function DevicesMenu() {
  return (
    <div className="">
      <div className="flex flex-col justify-center items-center w-full">
        <Table />
        <Link
          href="/admin/userRegistration"
          className="p-1 text-blue-500 flex items-center my-5"
        >
          <img src="/svg/addNewUser.svg" className="h-20"></img>
          Agregar nuevo dispositivo
        </Link>
      </div>
    </div>
  );
}

export default DevicesMenu;
