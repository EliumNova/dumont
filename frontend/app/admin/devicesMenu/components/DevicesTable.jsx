'use client';
import Image from 'next/image';
import { useState } from 'react';
import NewDevice from './NewDevice';

export default function DevicesTable({ devices }) {
  return (
    <div className="grid items-center gap-5">
      <div className="rounded-xl overflow-hidden border border-black border-slate-400">
        <table className="min-w-full border-collapse">
          <thead className="font-medium text-gray-600">
            <tr>
              <th scope="col" className="px-6 py-6 text-center ">
                Número de serie
              </th>
              <th scope="col" className="px-6 py-6 text-center ">
                Marca
              </th>
              <th scope="col" className="px-6 py-6 text-center ">
                Modelo
              </th>
              <th scope="col" className="px-6 py-6 text-center ">
                Titular
              </th>
              <th scope="col" className="px-6 py-6 text-center ">
                Estado
              </th>
              <th scope="col" className="px-6 py-6 text-center ">
                Localización
              </th>
              <th scope="col" className="px-6 py-6 text-center ">
                Editar
              </th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device, index) => (
              <tr
                key={index}
                className="border-t border-slate-400 text-gray-600 font-light"
              >
                <td className="whitespace-nowrap py-6 text-center text-sm">
                  {device.numSerie}
                </td>
                <td className="whitespace-nowrap py-6 text-center">
                  {device.marca}
                </td>
                <td className="whitespace-nowrap py-6 text-center">
                  {device.modelo}
                </td>
                <td className="whitespace-nowrap py-6 text-center">
                  {device.pulgadas}
                </td>
                <td className="whitespace-nowrap py-6 text-center flex justify-center gap-2 items-center text-sm">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      device.estado === 'true' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></div>
                </td>
                <td className="whitespace-nowrap py-6 text-center text-sm">
                  {device.ubicacion}
                </td>
                <td className="whitespace-nowrap py-6 text-center text-sm">
                  <Image
                    alt=""
                    src="/svg/deviceIcon.svg"
                    width={30}
                    height={30}
                    priority
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
