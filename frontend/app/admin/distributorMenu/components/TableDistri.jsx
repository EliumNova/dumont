"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { DISTRIBUIDORES } from "@/lib/slices/constants";
import {
  getDistribuidores,
  distribuidorDelete,
} from "@/lib/slices/distribuidores/distribuidorAction";
import EditDistBtn from "./EditDistBtn";
import { AiOutlineEye, AiOutlineDelete } from "react-icons/ai";
import Modal from "./Modal";
import ModalDelete from "./ModalDelete";
import DetailGrid from "../../components/DetailGrid";
import CarteraModal from "./CarteraModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("Nombre");

  const [selectedDistribuidor, setSelectedDistribuidor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [carteraDistribuidor, setCarteraDistribuidor] = useState(null);

  const [distToDelete, setDistToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getDistribuidores({ page, pageSize }));
  }, [dispatch, refresh, page, pageSize]);

  // Lista completa (sin paginar) para que el buscador encuentre cualquier
  // distribuidor, incluso uno recién creado que todavía no aparece en la
  // página actual de la tabla paginada.
  const [fullList, setFullList] = useState([]);

  useEffect(() => {
    axios
      .get(`${DISTRIBUIDORES}?page=0&pageSize=10000`)
      .then((res) => setFullList(res.data.rows || []))
      .catch((err) => console.log(err));
  }, [refresh]);

  const forceRender = () => setRefresh(!refresh);

  const handleView = (dist) => {
    setSelectedDistribuidor(dist);
    setIsModalOpen(true);
  };

  const handleCartera = (dist) => setCarteraDistribuidor(dist);

  const closeModal = () => {
    setSelectedDistribuidor(null);
    setIsModalOpen(false);
  };

  const closeCarteraModal = () => setCarteraDistribuidor(null);

  const openDeleteModal = (dist) => {
    setDistToDelete(dist);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDistToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = (idDistribuidor) => {
    dispatch(distribuidorDelete(idDistribuidor));
    toast.success("Distribuidor eliminado");
    forceRender();
    closeDeleteModal();
  };

  const isSearching = search.trim() !== "";

  // Mientras se busca, filtramos sobre la lista completa (fullList) para no
  // quedar limitados a la página actual (de 5, 10, etc.). Sin búsqueda activa,
  // se usa la lista paginada normal que viene del servidor.
  const sourceList = isSearching ? fullList : distribuidores;

  const filteredDistribuidores = sourceList.filter((dist) => {
    const q = search.toLowerCase();
    if (!q) return true;

    switch (searchType) {
      case "Nombre":
        return String(dist.NombreComercial ?? "")
          .toLowerCase()
          .includes(q);

      case "Código":
        return String(dist.CodigoDistribuidor ?? "")
          .toLowerCase()
          .includes(q);

      case "CUIT":
        return String(dist.CUIT ?? "")
          .toLowerCase()
          .includes(q);

      default:
        return true;
    }
  });

  const totalPages = isSearching
    ? Math.max(1, Math.ceil(filteredDistribuidores.length / pageSize))
    : Math.max(1, Math.ceil(totalDistribuidores / pageSize));

  // Si la página quedó fuera de rango (ej. se borró el último de la página),
  // vuelve a la última válida en vez de mostrar una tabla vacía.
  useEffect(() => {
    if (page > totalPages - 1) setPage(totalPages - 1);
  }, [page, totalPages]);

  // Cuando se busca, paginamos localmente sobre los resultados filtrados.
  const pagedDistribuidores = isSearching
    ? filteredDistribuidores.slice(page * pageSize, page * pageSize + pageSize)
    : filteredDistribuidores;

  return (
    <div className="flex flex-col border border-[#F2F5F6] rounded w-auto bg-[#F2F5F6] mt-4 max-h-[600px] overflow-y-auto p-4">
      {/* Buscador */}
      <div className="flex gap-2 mb-4 items-center">
        <select
          className="p-1 border rounded"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}>
          <option value="Nombre">Nombre</option>
          <option value="Código">Código Distribuidor</option>
          <option value="CUIT">CUIT</option>
        </select>
        <input
          className="p-2 border rounded flex-1"
          type="text"
          placeholder={`Buscar por ${searchType}...`}
          value={search}
          onChange={(e) => {
            setPage(0);
            setSearch(e.target.value);
          }}
        />
      </div>

      {/* Selector de cantidad por página y paginación */}
      <div className="flex items-center justify-between px-4 py-2 mb-2">
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
          </select>
          distribuidores por página
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

      {/* Tabla */}
      <div className="overflow-y-auto max-h-[500px]">
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
            {pagedDistribuidores.length > 0 ? (
              pagedDistribuidores.map((dist) => (
                <tr
                  key={dist.idDistribuidor}
                  className="mac-row border-b text-black hover:bg-neutral-100">
                  <td className="whitespace-nowrap px-10 py-6 text-center font-medium">
                    {dist.NombreComercial || "No disponible"}
                  </td>
                  <td className="whitespace-nowrap px-10 py-6 text-center">
                    {dist.Email || "No disponible"}
                  </td>
                  <td className="whitespace-nowrap px-10 py-6 text-center">
                    {dist.Telefono || "No disponible"}
                  </td>
                  <td className="whitespace-nowrap px-10 py-6 text-center">
                    {dist.Calle && dist.Localidad
                      ? `${dist.Calle}, ${dist.Localidad}`
                      : "No disponible"}
                  </td>
                  <td className="whitespace-nowrap px-10 py-6 flex justify-center items-center gap-2 h-full">
                    <AiOutlineEye
                      className="cursor-pointer text-2xl"
                      onClick={() => handleView(dist)}
                    />
                    <EditDistBtn
                      datos={dist}
                      onEditComplete={() => {
                        dispatch(getDistribuidores({ page, pageSize }));
                      }}
                    />

                    <AiOutlineDelete
                      className="cursor-pointer text-2xl"
                      onClick={() => openDeleteModal(dist)}
                    />
                    <button
                      className="mac-press rounded-lg bg-blue-500 px-3 py-1.5 text-white hover:bg-blue-600"
                      onClick={() => handleCartera(dist)}>
                      Ver Cartera
                    </button>
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

      {/* Modales */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedDistribuidor?.NombreComercial || "Detalles del Distribuidor"}>
        {selectedDistribuidor && (
          <DetailGrid
            items={[
              { label: "Nombre comercial", value: selectedDistribuidor.NombreComercial },
              { label: "Razón social", value: selectedDistribuidor.RazonSocial },
              { label: "CUIT", value: selectedDistribuidor.CUIT },
              { label: "Código distribuidor", value: selectedDistribuidor.CodigoDistribuidor },
              { label: "Email", value: selectedDistribuidor.Email },
              { label: "Teléfono", value: selectedDistribuidor.Telefono },
              { label: "Teléfono (jefe de ventas)", value: selectedDistribuidor.SegundoTelefono },
              { label: "Calle", value: selectedDistribuidor.Calle },
              { label: "Localidad", value: selectedDistribuidor.Localidad },
              { label: "Entre calles", value: selectedDistribuidor.EntreCalles },
            ]}
          />
        )}
      </Modal>

      {carteraDistribuidor && (
        <CarteraModal
          distribuidor={carteraDistribuidor}
          onClose={closeCarteraModal}
        />
      )}

      <ModalDelete isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <div className="py-2 text-center">
          <h3 className="mb-1 text-lg font-semibold">Eliminar distribuidor</h3>
          <p className="mb-5 text-sm text-gray-600">
            ¿Seguro que querés eliminar a{" "}
            <strong>{distToDelete?.NombreComercial}</strong>? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-center gap-3">
            <button
              className="mac-press rounded-xl border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-gray-100"
              onClick={closeDeleteModal}>
              Cancelar
            </button>
            <button
              className="mac-press rounded-xl bg-red-500 px-5 py-2 text-sm font-medium text-white hover:bg-red-600"
              onClick={() => handleDelete(distToDelete.idDistribuidor)}>
              Eliminar
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
