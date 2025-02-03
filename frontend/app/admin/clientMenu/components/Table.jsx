'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients, deleteClient } from '@/lib/slices/clients/clientAction';
import { AiOutlineEye, AiOutlineDelete } from 'react-icons/ai';

function ClientTable() {
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.clients.allClients || []);
  const [selectedClient, setSelectedClient] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch, refresh]);

  useEffect(() => {
    console.log('Clients:', clients); // Log para verificar los datos de clientes
  }, [clients]);

  const forceRender = () => {
    setRefresh(!refresh);
  };

  const handleDelete = (id) => {
    console.log('Delete client ID:', id); // Log para verificar la ID del cliente a eliminar
    dispatch(deleteClient(id));
    forceRender();
  };

  const handleViewDetails = (client) => {
    console.log('View details for client:', client); // Log para verificar los datos del cliente seleccionado
    setSelectedClient(client);
  };

  return (
    <div className="flex flex-col border border-[#F2F5F6] rounded w-full bg-[#F2F5F6] mt-4">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium dark:border-[#F2F5F6]">
                <tr className="text-black">
                  <th scope="col" className="px-10 py-6 text-center">
                    Nombre Completo
                  </th>
                  <th scope="col" className="px-10 py-6 text-center">
                    Correo Electrónico
                  </th>
                  <th scope="col" className="px-10 py-6 text-center">
                    Código Cliente
                  </th>
                  <th scope="col" className="px-10 py-6 text-center">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(clients) &&
                  clients.map((client, index) => (
                    <tr
                      className="border-b transition duration-300 ease-in-out text-black hover:bg-neutral-100 dark:border-[#F2F5F6] dark:hover:bg-[#d2dadd]"
                      key={index}
                    >
                      <td className="whitespace-nowrap px-10 py-6 text-center font-medium">
                        {client.NombreCompleto || 'Nombre no disponible'}
                      </td>
                      <td className="whitespace-nowrap px-10 py-1 text-center">
                        {client.Email || 'Correo no disponible'}
                      </td>
                      <td className="whitespace-nowrap px-10 py-1 text-center">
                        {client.CodigoCliente || 'Código no disponible'}
                      </td>
                      <td className="whitespace-nowrap px-10 py-6 flex justify-center items-center gap-4 h-full">
                        <div className="flex items-center h-full">
                          <AiOutlineEye
                            className="cursor-pointer text-2xl"
                            onClick={() => handleViewDetails(client)}
                          />
                        </div>
                        <div className="flex items-center h-full">
                          <AiOutlineDelete
                            className="cursor-pointer text-2xl"
                            onClick={() => handleDelete(client.idClientes)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {selectedClient && (
              <div className="mt-4 p-4 bg-white rounded shadow-lg text-center grid grid-cols-3 gap-4">
                <h3 className="col-span-3">Detalles del Cliente</h3>
                <div>
                  <p>
                    <strong>Nombre Completo</strong>
                  </p>
                  <p>{selectedClient.NombreCompleto}</p>
                </div>
                <div>
                  <p>
                    <strong>Correo Electrónico</strong>
                  </p>
                  <p>
                    <a
                      href={`mailto:${selectedClient.Email}`}
                      className="text-blue-500 underline"
                    >
                      {selectedClient.Email}
                    </a>
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Código Cliente</strong>
                  </p>
                  <p>{selectedClient.CodigoCliente}</p>
                </div>
                <div>
                  <p>
                    <strong>Código Distribuidor</strong>
                  </p>
                  <p>{selectedClient.CodigoDistribuidor}</p>
                </div>
                <div>
                  <p>
                    <strong>Segmentación</strong>
                  </p>
                  <p>{selectedClient.Segmentacion}</p>
                </div>
                <div>
                  <p>
                    <strong>Localidad</strong>
                  </p>
                  <p>{selectedClient.Localidad}</p>
                </div>
                <div>
                  <p>
                    <strong>Calle</strong>
                  </p>
                  <p>{selectedClient.Calle}</p>
                </div>
                <div>
                  <p>
                    <strong>Entre Calles</strong>
                  </p>
                  <p>{selectedClient.EntreCalles}</p>
                </div>
                <div>
                  <p>
                    <strong>Teléfono</strong>
                  </p>
                  <p>{selectedClient.Telefono}</p>
                </div>
                <div>
                  <p>
                    <strong>Venta Alcohol</strong>
                  </p>
                  <p>{selectedClient.VentaAlcohol ? 'Sí' : 'No'}</p>
                </div>
                <div>
                  <p>
                    <strong>Página Web</strong>
                  </p>
                  <p>
                    <a
                      href={selectedClient.WebPage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {selectedClient.WebPage}
                    </a>
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Horario de Venta</strong>
                  </p>
                  <p>{selectedClient.HorarioVenta}</p>
                </div>
                <div>
                  <p>
                    <strong>Horario On/Off Dispositivos</strong>
                  </p>
                  <p>{selectedClient.HorarioOnOffDispositivos}</p>
                </div>
                <div>
                  <p>
                    <strong>Horario Publicitario</strong>
                  </p>
                  <p>{selectedClient.HorarioPublicitario}</p>
                </div>
                <div>
                  <p>
                    <strong>Atención al Cliente</strong>
                  </p>
                  <p>
                    <a
                      href={`tel:${selectedClient.AtencionAlCliente}`}
                      className="text-blue-500 underline"
                    >
                      {selectedClient.AtencionAlCliente}
                    </a>
                  </p>
                </div>
                <button
                  className="col-span-3 mt-2 p-2 bg-blue-500 text-white rounded w-2/6 justify-self-center"
                  onClick={() => setSelectedClient(null)}
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientTable;
