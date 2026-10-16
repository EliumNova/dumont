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
import DetailGrid from "../../components/DetailGrid";
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
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  // Debounce del buscador: espera 350 ms sin tipear y vuelve a la página 1.
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery((prev) => {
        if (prev !== search.trim()) setPage(0);
        return search.trim();
      });
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    dispatch(fetchClients({ page, pageSize, q: query }));
  }, [dispatch, page, pageSize, query, refresh]);

  // Si la página queda fuera de rango (ej. se borró el último de la página), vuelve a la última válida.
  useEffect(() => {
    const last = Math.max(Math.ceil(totalClients / pageSize) - 1, 0);
    if (page > last) setPage(last);
  }, [totalClients, pageSize, page]);

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

  const totalPages = Math.max(Math.ceil(totalClients / pageSize), 1);

  return (
    <div className="flex flex-col border border-[#F2F5F6] rounded w-auto bg-[#F2F5F6] mt-4">
      <div className="overflow-y-auto overflow-x-hidden max-h-[500px] scrollbar-hidden-unless-needed">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <div className="px-4 pt-2">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, código, dirección, teléfono o mail…"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
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
                  className="mac-press rounded-lg bg-gray-200 px-3 py-1.5 text-sm hover:bg-gray-300 disabled:opacity-40"
                  onClick={() => setPage((p) => Math.max(p - 1, 0))}
                  disabled={page === 0}>
                  Anterior
                </button>
                <span className="text-sm">
                  Página {page + 1} de {totalPages}
                </span>
                <button
                  className="mac-press rounded-lg bg-gray-200 px-3 py-1.5 text-sm hover:bg-gray-300 disabled:opacity-40"
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
                  clients.map((client) => (
                    <tr
                      className="mac-row border-b text-black hover:bg-neutral-100 dark:border-[#F2F5F6] dark:hover:bg-[#d2dadd]"
                      key={client.idClientes}>
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
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedClient?.NombreCompleto || "Detalles del Cliente"}>
        {selectedClient && (
          <DetailGrid
            items={[
              { label: "Nombre completo", value: selectedClient.NombreCompleto },
              {
                label: "Correo electrónico",
                value: selectedClient.CorreoElectronico ? (
                  <a
                    href={`mailto:${selectedClient.CorreoElectronico}`}
                    className="text-blue-600 underline">
                    {selectedClient.CorreoElectronico}
                  </a>
                ) : null,
              },
              { label: "Segmentación", value: selectedClient.Segmentacion },
              { label: "Código cliente", value: selectedClient.CodigoCliente },
              { label: "Código distribuidor", value: selectedClient.CodigoDistribuidor },
              { label: "Código DuMont", value: selectedClient.CodigoDumont },
              { label: "Calle", value: selectedClient.Calle },
              {
                label: "Entre calles",
                value:
                  selectedClient.EntreCalle1 || selectedClient.EntreCalle2
                    ? `${selectedClient.EntreCalle1 || "—"} y ${selectedClient.EntreCalle2 || "—"}`
                    : null,
              },
              { label: "Localidad", value: selectedClient.Localidad },
              { label: "Teléfono", value: selectedClient.Telefono },
              { label: "Venta de alcohol", value: selectedClient.VentaAlcohol ? "Sí" : "No" },
              {
                label: "Página web",
                value: selectedClient.WebPage ? (
                  <a
                    href={selectedClient.WebPage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline">
                    {selectedClient.WebPage}
                  </a>
                ) : (
                  "No posee"
                ),
              },
              { label: "Horario de venta", value: selectedClient.HorarioVenta },
            ]}
          />
        )}
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <ModalDelete isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <div className="py-2 text-center">
          <h3 className="mb-1 text-lg font-semibold">Eliminar cliente</h3>
          <p className="mb-5 text-sm text-gray-600">
            ¿Seguro que querés eliminar a{" "}
            <strong>{clientToDelete?.NombreCompleto}</strong>? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-center gap-3">
            <button
              className="mac-press rounded-xl border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-gray-100"
              onClick={closeDeleteModal}>
              Cancelar
            </button>
            <button
              className="mac-press rounded-xl bg-red-500 px-5 py-2 text-sm font-medium text-white hover:bg-red-600"
              onClick={() => handleDelete(clientToDelete.idClientes)}>
              Eliminar
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
