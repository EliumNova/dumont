'use client';

import React, { useState } from 'react';
import Image from 'next/image'; // Asegúrate de que esto esté presente

function Table() {
  const [devices, setDevices] = useState([
    {
      numSerie: 'F4JM3NOOLPP3',
      marca: 'Apple',
      modelo: '11 PRO Max',
      pulgadas: '6,6',
      estado: 'true',
      ubicacion: 'Si',
    },
    {
      numSerie: '8MKJ6UIPL5VC',
      marca: 'Samsung',
      modelo: 'Galaxy A23',
      pulgadas: '6,5',
      estado: 'false',
      ubicacion: 'No',
    },
    {
      numSerie: '3519J2MSK2KO',
      marca: 'Samsung',
      modelo: 'Galaxy A05',
      pulgadas: '6,6H',
      estado: 'false',
      ubicacion: 'Si',
    },
    {
      numSerie: '823ANDK2NKDL',
      marca: 'Samsung',
      modelo: 'Galaxy A05',
      pulgadas: '6,7',
      estado: 'true',
      ubicacion: 'Si',
    },
  ]);

  return (
    <div className="flex flex-col border border-[#12141D] rounded bg-[#12141D]">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr className="text-white">
                  <th scope="col" className="px-6 py-3 text-center">
                    Número de serie
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Marca
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Modelo
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Pulgadas
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Localización a tiempo real
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
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
                    <td className="whitespace-nowrap px-6 py-3 text-center">
                      {device.numSerie}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-center">
                      {device.marca}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-center">
                      {device.modelo}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-center">
                      {device.pulgadas}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-center flex justify-center gap-2 items-center">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          device.estado === 'true'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      ></div>
                      {device.estado === 'true' ? 'En línea' : 'Desconectado'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-center">
                      {device.ubicacion}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-center">
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
      </div>
    </div>
  );
}

export default Table;
