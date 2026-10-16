"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/lib/slices/users/userAction";
import EditUserBtn from "./EditUserBtn";

function Table() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.allUsers) || [];
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch, refresh]);

  const forceRender = () => setRefresh((r) => !r);

  return (
    <div className="mac-fade-up overflow-hidden rounded-3xl bg-white/90 shadow-xl backdrop-blur">
      <div className="max-h-[70vh] overflow-auto">
        <table className="tabla-resp min-w-full text-left text-sm text-[#191920]">
          <thead className="sticky top-0 bg-[#F2F5F6] text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Nombre completo</th>
              <th className="px-6 py-4 font-semibold">Correo electrónico</th>
              <th className="px-6 py-4 font-semibold">DNI</th>
              <th className="px-6 py-4 font-semibold">Rol</th>
              <th className="px-6 py-4 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.idUsuarios} className="mac-row border-t border-black/5 hover:bg-blue-50/60">
                <td data-label="Nombre" className="whitespace-nowrap px-6 py-4 font-medium">{user.Name}</td>
                <td data-label="Correo" className="whitespace-nowrap px-6 py-4">{user.Email}</td>
                <td data-label="DNI" className="whitespace-nowrap px-6 py-4">{user.DNI}</td>
                <td data-label="Rol" className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      user.isAdmin ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                    }`}>
                    {user.isAdmin ? "Administrador" : "Usuario"}
                  </span>
                </td>
                <td data-label="" className="acciones whitespace-nowrap px-6 py-3 text-right">
                  <EditUserBtn datos={user} onCloseModal={forceRender} />
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  No hay usuarios para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
