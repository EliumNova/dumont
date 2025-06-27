'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDistribuidores,
  distribuidorDelete,
} from '@/lib/slices/distribuidores/distribuidorAction';
import EditDistBtn from './EditDistBtn';
import { AiOutlineEye, AiOutlineDelete } from 'react-icons/ai';
import Modal from './Modal';
import ModalDelete from './ModalDelete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DistribuidorTable() {
  const dispatch = useDispatch();
  const distribuidores = useSelector(
    (state) => state.distribuidores.allDistribuidores.rows || []
  );
  const totalDistribuidores = useSelector(
    (state) => state.distribuidores.allDistribuidores.count || 0
  );

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [refresh, setRefresh] = useState(false);
  const [selectedDistribuidor, setSelectedDistribuidor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [distToDelete, setDistToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getDistribuidores({ page, pageSize }));
  }, [dispatch, refresh, page, pageSize]);

  const forceRender = () => {
    setRefresh(!refresh);
  };

  const handleView = (dist) => {
    setSelectedDistribuidor(dist);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDistribuidor(null);
    setIsModalOpen(false);
  };

  const openDeleteModal = (dist) => {
    setDistToDelete(dist);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDistToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = (id) => {
    dispatch(distribuidorDelete(id)).then(() => {
      toast.success('Distribuidor eliminado');
      forceRender();
      closeDeleteModal();
    });
  };

  const totalPages = Math.ceil(totalDistribuidores / pageSize);

  return (
    <div className="flex flex-col border border-[#F2F5F6] rounded w-auto bg-[#F2F5F6] mt-4 max-h-[600px] overflow-y-auto">
      {/* Selector de cantidad por página */}
      <div className="flex items-center justify-between px-4 py-2">
        <label className="text-sm text-gray-700">
          Mostrar:
          <select
            value={pageSize}
            onChange={(e) => {
              setPage(0); // volver al inicio
              setPageSize(Number(e.target.value));
            }}
            className="ml-2 p-1 border rounded"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          distribuidores por página
        </label>

        {/* Paginación */}
        <div className="flex gap-2 items-center">
          <button
            className="px-2 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
          >
            Anterior
          </button>
          <span className="text-sm">
            Página {page + 1} de {totalPages}
          </span>
          <button
            className="px-2 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            onClick={() => setPage((p) => p + 1)}
            disabled={page + 1 >= totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-y-auto scrollbar-gutter: stable both-edges overflow-x-hidden max-h-[500px]">
        <table className="min-w-full text-left text-sm font-light whitespace-nowrap">
          <thead className="border-b font-medium dark:border-[#F2F5F6] text-black">
            <tr>
              <th className="px-10 py-6 text-center">Nombre</th>
              <th className="px-10 py-6 text-center">Correo</th>
              <th className="px-10 py-6 text-center">Teléfono</th>
              <th className="px-10 py-6 text-center">Dirección</th>
              <th className="px-10 py-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {distribuidores.length > 0 ? (
              distribuidores.map((dist, index) => (
                <tr
                  key={index}
                  className="border-b transition duration-300 ease-in-out text-black hover:bg-neutral-100 dark:border-[#F2F5F6] dark:hover:bg-[#d2dadd]"
                >
                  <td className="whitespace-nowrap px-10 py-6 text-center font-medium">
                    {dist.NombreComercial || 'No disponible'}
                  </td>
                  <td className="whitespace-nowrap px-10 py-6 text-center">
                    {dist.Email || 'No disponible'}
                  </td>
                  <td className="whitespace-nowrap px-10 py-6 text-center">
                    {dist.Telefono || 'No disponible'}
                  </td>
                  <td className="whitespace-nowrap px-10 py-6 text-center">
                    {dist.Calle && dist.Localidad
                      ? `${dist.Calle}, ${dist.Localidad}`
                      : 'No disponible'}
                  </td>
                  <td className="whitespace-nowrap px-10 py-6 flex justify-center items-center gap-4 h-full">
                    <AiOutlineEye
                      className="cursor-pointer text-2xl"
                      onClick={() => handleView(dist)}
                    />
                    <EditDistBtn
                      className="cursor-pointer text-2xl"
                      distribuidor={dist}
                      onEditComplete={forceRender}
                    />
                    <AiOutlineDelete
                      className="cursor-pointer text-2xl"
                      onClick={() => openDeleteModal(dist)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No hay distribuidores disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedDistribuidor && (
          <div className="mt-4 p-4 bg-white rounded shadow-lg text-center grid grid-cols-2 gap-4 text-black">
            <h3 className="col-span-2 font-semibold text-lg mb-2">
              Detalles del Distribuidor
            </h3>
            <div>
              <p className="font-semibold">Nombre Comercial</p>
              <p>{selectedDistribuidor.NombreComercial}</p>
            </div>
            <div>
              <p className="font-semibold">Razón Social</p>
              <p>{selectedDistribuidor.RazonSocial}</p>
            </div>
            <div>
              <p className="font-semibold">CUIT</p>
              <p>{selectedDistribuidor.CUIT}</p>
            </div>
            <div>
              <p className="font-semibold">Código Distribuidor</p>
              <p>{selectedDistribuidor.CodigoDistribuidor}</p>
            </div>
            <div>
              <p className="font-semibold">Email</p>
              <p>{selectedDistribuidor.Email}</p>
            </div>
            <div>
              <p className="font-semibold">Teléfono</p>
              <p>{selectedDistribuidor.Telefono}</p>
            </div>
            <div>
              <p className="font-semibold">Teléfono (Jefe de Ventas)</p>
              <p>{selectedDistribuidor.SegundoTelefono}</p>
            </div>
            <div>
              <p className="font-semibold">Calle</p>
              <p>{selectedDistribuidor.Calle}</p>
            </div>
            <div>
              <p className="font-semibold">Localidad</p>
              <p>{selectedDistribuidor.Localidad}</p>
            </div>
            <div>
              <p className="font-semibold">Entre Calles</p>
              <p>{selectedDistribuidor.EntreCalles}</p>
            </div>
          </div>
        )}
      </Modal>

      <ModalDelete isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <div className="mt-4 p-4 bg-white rounded shadow-lg text-center">
          <h3 className="text-lg font-bold mb-4">
            ¿Estás seguro de que deseas eliminar este distribuidor?
          </h3>
          <div className="flex justify-center gap-4">
            <button
              className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => handleDelete(distToDelete.idDistribuidor)}
            >
              Eliminar
            </button>
            <button
              className="flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={closeDeleteModal}
            >
              Cancelar
            </button>
          </div>
        </div>
      </ModalDelete>

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
