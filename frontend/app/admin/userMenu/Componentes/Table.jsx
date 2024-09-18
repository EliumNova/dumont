"use client";

import React, { useState } from 'react'

function Table() {
    const [user, setUsers] = useState([
        {
          name: "Esther Howard",
          email: "esther.howard@example",
          dni: "40146000",
          rolAdmin: "Si",
          icon: "x",
        },
        {
          name: "Esther Howard",
          email: "esther.howard@example",
          dni: "40146000",
          rolAdmin: "Si",
          icon: "x",
        },
        {
          name: "Esther Howard",
          email: "esther.howard@example",
          dni: "40146000",
          rolAdmin: "Si",
          icon: "x",
        },
        {
          name: "Esther Howard",
          email: "esther.howard@example",
          dni: "40146000",
          rolAdmin: "Si",
          icon: "x",
        },
        {
          name: "Esther Howard",
          email: "esther.howard@example",
          dni: "40146000",
          rolAdmin: "Si",
          icon: "x",
        },
        {
          name: "Esther Howard",
          email: "esther.howard@example",
          dni: "40146000",
          rolAdmin: "Si",
          icon: "x",
        },
      ]);
  return (
    <div className="flex flex-col border border-black rounded w-9/12">
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
        <div className="overflow-hidden">
          <table className="min-w-full text-left text-sm font-light">
            <thead className="border-b font-medium dark:border-neutral-500">
              <tr>
                <th scope="col" className="px-10 py-6">
                  Nombre completo
                </th>
                <th scope="col" className="px-10 py-6">
                  Correo Electronico
                </th>
                <th scope="col" className="px-10 py-6">
                  DNI
                </th>
                <th scope="col" className="px-10 py-6">
                  Rol Administrador
                </th>
                <th scope="col" className="px-10 py-6">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {user.map((users, index) => (
                <tr className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                key={index}>
                  <td className="whitespace-nowrap px-10 py-6 font-medium">
                    {users.name}
                  </td>
                  <td className="whitespace-nowrap px-10 py-6"> {users.email}</td>
                  <td className="whitespace-nowrap px-10 py-6">{users.dni}</td>
                  <td className="whitespace-nowrap px-10 py-6">{users.rolAdmin}</td>
                  <td className="whitespace-nowrap px-10 py-6">{users.icon}</td>
                </tr>
              ))}
            
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Table