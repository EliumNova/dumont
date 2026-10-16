"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClients, deleteClient } from "@/lib/slices/clients/clientAction";
import {
  AiOutlineEye,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineCheck,
  AiOutlineClose,
} from "react-icons/ai";
import Modal from "./Modal"; // Importa el componente Modal
import ModalDelete from "./ModalDelete"; // Importa el componente Modal
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ClientTable() {
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.clients.data?.rows || []);
  const totalClients = useSelector((state) => state.clients.data?.count || 0);

  const [selectedClient, setSelectedClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    dispatch(fetchClients({ page, pageSize }));
  }, [dispatch, page, pageSize, refresh]);

  useEffect(() => {
  }, [clients]);

  const forceRender = () => {
    setRefresh(!refresh);
  };

  const handleDelete = (id) => {
    dispatch(deleteClient(id)).then(() => {
      toast.success("Usuario eliminado");
      forceRender();
      setIsDeleteModalOpen(false);
    });
  };

  const handleEdit = (client) => {
    window.location.href = `admin/clientMenu/Pages/EditClient?id=${client.idClientes}`;
  };

  const handleViewDetails = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true); // Abre el modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Cierra el modal
    setSelectedClient(null); // Limpia el cliente seleccionado
  };

  const openDeleteModal = (client) => {
    setClientToDelete(client);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setClientToDelete(null);
  };

  const totalPages = Math.ceil(totalClients / pageSize);

  return (
    <div className="flex flex-col border border-[#F2F5F6] rounded w-auto bg-[#F2F5F6] mt-4">
      <div className="overflow-y-auto overflow-x-hidden max-h-[500px] scrollbar-hidden-unless-needed">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2">
              <label className="text-sm text-gray-700">
                Mostrar:
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPage(0);
                    setPageSize(Number(e.target.value));
                  }}
                  className="ml-2 p-1 border rounded">
                  {[5, 10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>{" "}
                clientes por página
              </label>

              <div className="flex gap-2 items-center">
                <button
                  className="px-2 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(p - 1, 0))}
                  disabled={page === 0}>
                  Anterior
                </button>
                <span className="text-sm">
                  Página {page + 1} de {totalPages}
                </span>
                <button
                  className="px-2 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page + 1 >= totalPages}>
                  Siguiente
                </button>
              </div>
            </div>
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium dark:border-[#F2F5F6]">
                <tr className="text-black">
                  <th scope="col" className="px-10 py-6 text-center">
                    Nombre Completo
                  </th>
                  <th scope="col" className="px-10 py-6 text-center">
                    Dirección
                  </th>
                  <th scope="col" className="px-10 py-6 text-center">
                    Teléfono
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
                      key={index}>
                      <td className="whitespace-nowrap px-10 py-6 text-center font-medium">
                        {client.NombreCompleto || "Nombre no disponible"}
                      </td>
                      <td className="whitespace-nowrap px-10 py-1 text-center">
                        {`${client.Calle}, ${client.Localidad}` ||
                          "Correo no disponible"}
                      </td>
                      <td className="whitespace-nowrap px-10 py-1 text-center">
                        {client.Telefono || "Código no disponible"}
                      </td>
                      <td className="whitespace-nowrap px-10 py-6 flex justify-center items-center gap-4 h-full">
                        <div className="flex items-center h-full">
                          <AiOutlineEye
                            className="cursor-pointer text-2xl"
                            onClick={() => handleViewDetails(client)}
                          />
                        </div>
                        <div className="flex items-center h-full">
                          <AiOutlineEdit
                            className="cursor-pointer text-2xl"
                            onClick={() => handleEdit(client)}
                          />
                        </div>
                        <div className="flex items-center h-full">
                          <AiOutlineDelete
                            className="cursor-pointer text-2xl"
                            onClick={() => openDeleteModal(client)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal para mostrar los detalles del cliente */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
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
                  href={`mailto:${selectedClient.CorreoElectronico}`}
                  className="text-blue-500 underline">
                  {selectedClient.CorreoElectronico}
                </a>
              </p>
            </div>
            <div>
              <p>
                <strong>Segmentación</strong>
              </p>
              <p>{selectedClient.Segmentacion}</p>
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
                <strong>Código DuMont</strong>
              </p>
              <p>{selectedClient.CodigoDumont || "Código no disponible"}</p>
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
              <p>
                {selectedClient.EntreCalle1} y {selectedClient.EntreCalle2}
              </p>
            </div>
            <div>
              <p>
                <strong>Localidad</strong>
              </p>
              <p>{selectedClient.Localidad}</p>
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
              <p>{selectedClient.VentaAlcohol ? "Sí" : "No"}</p>
            </div>
            <div>
              <p>
                <strong>Página Web</strong>
              </p>
              <p>
                {selectedClient.WebPage ? (
                  <a
                    href={selectedClient.WebPage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-500">
                    {selectedClient.WebPage}
                  </a>
                ) : (
                  "No posee"
                )}
              </p>
            </div>
            <div></div>
            <div>
              <p>
                <strong>Horario de Venta</strong>
              </p>
              <p>{selectedClient.HorarioVenta}</p>
            </div>
            <div></div>
            <div></div>
          </div>
        )}
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <ModalDelete isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <div className="mt-4 p-4 bg-white rounded shadow-lg text-center">
          <h3 className="text-lg font-bold mb-4">
            ¿Estás seguro de que deseas eliminar este cliente?
          </h3>
          <div className="flex justify-center gap-4">
            <button
              className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => handleDelete(clientToDelete.idClientes)}>
              <AiOutlineCheck className="mr-2" />
              Eliminar
            </button>
            <button
              className="flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={closeDeleteModal}>
              <AiOutlineClose className="mr-2" />
              Cancelar
            </button>
          </div>
        </div>
      </ModalDelete>

      {/* ToastContainer para mostrar notificaciones */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default ClientTable;
