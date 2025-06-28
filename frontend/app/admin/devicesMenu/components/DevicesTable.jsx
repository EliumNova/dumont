'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDispositivos,
  dispositivoDelete,
} from '@/lib/slices/dispositivos/dispositivoAction';
import { fetchClients } from '@/lib/slices/clients/clientAction';
import { fetchRelacionesClientesDistribuidores } from '@/lib/slices/dispositivos/clientesDistribuidoresAction';
import {
  AiOutlineEye,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineCopy,
  AiOutlinePhone,
} from 'react-icons/ai';

import { FaPhotoFilm } from 'react-icons/fa6';
import Modal from './Modal';
import ModalDelete from './ModalDelete';
import MultimediaModal from './MultimediaModal.jsx';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function DeviceTable() {
  const dispatch = useDispatch();
  const dispositivos = useSelector(
    (state) => state.dispositivos.allDispositivos.rows || []
  );
  const totalDispositivos = useSelector(
    (state) => state.dispositivos.allDispositivos.count || 0
  );

  const { rows: clients = [], count: totalClients = 0 } = useSelector(
    (state) => state.clients.allClients || {}
  );

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [filtroPermisoAlcohol, setFiltroPermisoAlcohol] = useState('');
  const [filtroSegmentacion, setFiltroSegmentacion] = useState('');
  const [filtroCondicionFiscal, setFiltroCondicionFiscal] = useState('');
  const [isMultimediaModalOpen, setIsMultimediaModalOpen] = useState(false);
  const [currentMultimediaDevice, setCurrentMultimediaDevice] = useState(null);
  const relaciones = useSelector(
    (state) => state.clientesDistribuidores.allRelaciones || []
  );

  const [paginaActual, setPaginaActual] = useState(0); // página empieza en 0
  const [tamañoPagina, setTamañoPagina] = useState(5); // cantidad de elementos por página

  useEffect(() => {
    dispatch(getDispositivos({ page: paginaActual, pageSize: tamañoPagina }));
    dispatch(fetchClients());
    dispatch(fetchRelacionesClientesDistribuidores());
  }, [dispatch, refresh, paginaActual, tamañoPagina]);

  const forceRender = () => {
    setRefresh(!refresh);
  };

  const handleDelete = (id) => {
    dispatch(dispositivoDelete(id)).then(() => {
      toast.success('Dispositivo eliminado');
      forceRender();
      setIsDeleteModalOpen(false);
    });
  };

  const handleEdit = (device) => {
    if (typeof window !== 'undefined') {
      window.location.href = `admin/deviceMenu/Pages/EditDevice?id=${device.idDispositivos}`;
    }
  };

  const handleViewDetails = (dispositivo) => {
    setSelectedDevice(dispositivo);
    setIsModalOpen(true);
  };

  const handleViewClientDetails = async (codigoDumont) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/clientes/dumont/${codigoDumont}`
      );

      setSelectedClient(response.data);
      setIsClientModalOpen(true);
    } catch (error) {
      toast.error('Error al obtener los detalles del cliente');
    }
  };

  console.log('Dispositivos cargados:', dispositivos);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
  };

  const closeClientModal = () => {
    setIsClientModalOpen(false);
    setSelectedClient(null);
  };

  const openDeleteModal = (device) => {
    setDeviceToDelete(device);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeviceToDelete(null);
  };

  const getStatusColor = (device) => {
    if (device.estado === 'Apagado') return 'text-yellow-500';
    if (device.estado === 'En suspensión') return 'text-blue-500';
    if (device.signal === 'Wi-Fi' && device.battery === 'OK')
      return 'text-green-500';
    if (device.signal === 'Falla' && device.battery === 'OK')
      return 'text-yellow-500';
    return 'text-red-500';
  };

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/clientes-distribuidores')
      .then((res) => {
        console.log('Data sin Redux:', res.data);
      });
  }, []);

  const filterDevices = () => {
    return dispositivos
      .filter((device) => {
        const cliente = device.Cliente;
        if (!cliente) return false;

        if (!cliente) return false; // Evita errores si el cliente no está

        const relacion = relaciones.find(
          (r) => r.Cliente?.idClientes === cliente.idClientes
        );

        const segundoTelefono = relacion?.Distribuidor?.SegundoTelefono;

        const matchesSearch = [device.Marca, device.Modelo, device.NumSerie]
          .join(' ')
          .toLowerCase()
          .includes(filter.toLowerCase());

        const matchesAlcohol =
          filtroPermisoAlcohol !== ''
            ? String(cliente?.VentaAlcohol) === filtroPermisoAlcohol
            : true;

        const matchesSegmentacion = filtroSegmentacion
          ? cliente?.Segmentacion === filtroSegmentacion
          : true;

        const matchesCondFiscal = filtroCondicionFiscal
          ? cliente?.CondicionFiscal === filtroCondicionFiscal
          : true;

        return (
          matchesSearch &&
          matchesAlcohol &&
          matchesSegmentacion &&
          matchesCondFiscal
        );
      })
      .sort((a, b) => {
        if (!sortColumn) return 0;
        const aValue = (a[sortColumn] || '').toString().toLowerCase();
        const bValue = (b[sortColumn] || '').toString().toLowerCase();
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const openMultimediaModal = (device) => {
    setCurrentMultimediaDevice(device);
    setIsMultimediaModalOpen(true);
  };

  console.log('Relaciones cliente-distribuidor:', relaciones);

  return (
    <div className="flex flex-col border border-[#F2F5F6] rounded w-auto bg-[#F2F5F6] mt-4">
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

      <div className="overflow-y-auto overflow-x-hidden max-h-[500px] scrollbar-hidden-unless-needed">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8 scrollbar-hidden-unless-needed">
          <div className="overflow-hidden">
            {/* Filtro */}
            {/* Filtros Avanzados */}
            <div className="flex items-center justify-between mt-4 px-4">
              <div>
                <label className="mr-2">Dispositivos por página:</label>
                <select
                  value={tamañoPagina}
                  onChange={(e) => {
                    setPaginaActual(0); // volvés a la página 0 si cambia el tamaño
                    setTamañoPagina(Number(e.target.value));
                  }}
                  className="p-2 border rounded"
                >
                  {[5, 10, 20, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    setPaginaActual((prev) => Math.max(prev - 1, 0))
                  }
                  disabled={paginaActual === 0}
                  className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                >
                  Anterior
                </button>

                <span>
                  Página {paginaActual + 1} de{' '}
                  {Math.ceil(totalDispositivos / tamañoPagina)}
                </span>

                <button
                  onClick={() =>
                    setPaginaActual((prev) =>
                      prev + 1 < Math.ceil(totalDispositivos / tamañoPagina)
                        ? prev + 1
                        : prev
                    )
                  }
                  disabled={
                    paginaActual + 1 >=
                    Math.ceil(totalDispositivos / tamañoPagina)
                  }
                  className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>

            <br />

            <div className="mb-4 flex flex-wrap gap-4 items-center">
              <input
                type="text"
                placeholder="Buscar dispositivo"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="p-2 border rounded"
              />

              <select
                value={filtroPermisoAlcohol}
                onChange={(e) => setFiltroPermisoAlcohol(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Permiso Alcohol</option>
                <option value="1">Sí</option>
                <option value="0">No</option>
              </select>

              <select
                value={filtroSegmentacion}
                onChange={(e) => setFiltroSegmentacion(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Segmentación</option>
                <option value="Kiosco">Kiosco</option>
                <option value="Almacén">Almacén</option>
                <option value="Autoservicio">Autoservicio</option>
              </select>

              <select
                value={filtroCondicionFiscal}
                onChange={(e) => setFiltroCondicionFiscal(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Cond. Fiscal</option>
                <option value="Monotributo">Monotributo</option>
                <option value="Responsable Inscripto">
                  Responsable Inscripto
                </option>
                <option value="Consumidor Final">Consumidor Final</option>
              </select>
            </div>

            {/* Tabla */}
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium dark:border-[#F2F5F6]">
                <tr className="text-black">
                  <th
                    onClick={() => handleSort('idClientes')}
                    className="px-10 py-6 text-center cursor-pointer"
                  >
                    Cliente{' '}
                    {sortColumn === 'idClientes' &&
                      (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('Marca')}
                    className="px-10 py-6 text-center cursor-pointer"
                  >
                    Dispositivo{' '}
                    {sortColumn === 'Marca' &&
                      (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('estado')}
                    className="px-10 py-6 text-center cursor-pointer"
                  >
                    Estado{' '}
                    {sortColumn === 'estado' &&
                      (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-10 py-6 text-center">Coordenadas</th>

                  <th className="px-10 py-6 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filterDevices().map((dispositivo) => (
                  <tr
                    key={dispositivo.idDispositivos}
                    className="border-b transition duration-300 ease-in-out text-black hover:bg-neutral-100 dark:border-[#F2F5F6] dark:hover:bg-[#d2dadd]"
                  >
                    <td className="whitespace-nowrap px-10 py-6 text-center font-medium">
                      <button
                        className="text-blue-500"
                        onClick={() =>
                          handleViewClientDetails(dispositivo.CodigoCliente)
                        }
                      >
                        {dispositivo.CodigoCliente || 'Sin código'} -{' '}
                        {dispositivo.Cliente?.NombreCompleto || 'Sin nombre'}
                      </button>
                    </td>

                    <td className="whitespace-nowrap px-10 py-6 text-center">
                      {dispositivo.Marca} - {dispositivo.Modelo}
                    </td>
                    <td className="whitespace-nowrap px-10 py-6 text-center">
                      <span className={getStatusColor(dispositivo)}>
                        {dispositivo.estado || 'Desconocido'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-10 py-6 text-center">
                      {dispositivo.latitud && dispositivo.longitud
                        ? `${dispositivo.latitud}, ${dispositivo.longitud}`
                        : 'No disponible'}
                    </td>

                    <td className="whitespace-nowrap px-10 py-6 flex justify-center items-center gap-4">
                      <AiOutlineEye
                        className="cursor-pointer text-2xl"
                        onClick={() => handleViewDetails(dispositivo)}
                      />
                      <AiOutlineEdit
                        className="cursor-pointer text-2xl"
                        onClick={() => handleEdit(dispositivo)}
                      />
                      <AiOutlineDelete
                        className="cursor-pointer text-2xl"
                        onClick={() => openDeleteModal(dispositivo)}
                      />
                      <FaPhotoFilm
                        className="cursor-pointer text-2xl"
                        onClick={() => openMultimediaModal(dispositivo)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Detalles Dispositivo */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedDevice && (
          <div className="mt-4 p-4 bg-white rounded shadow-lg text-center grid grid-cols-2 gap-4">
            <h3 className="col-span-2 text-lg font-bold">
              Detalles del Dispositivo
            </h3>
            <div>
              <strong>Marca:</strong> {selectedDevice.Marca}
            </div>
            <div>
              <strong>Modelo:</strong> {selectedDevice.Modelo}
            </div>
            <div>
              <strong>Número de Serie:</strong> {selectedDevice.NumSerie}
            </div>
            <div>
              <strong>Coordenadas</strong>
              {selectedDevice.latitud}, {selectedDevice.longitud}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Detalles Cliente */}
      <Modal isOpen={isClientModalOpen} onClose={closeClientModal}>
        {selectedClient &&
          (() => {
            const relacion = relaciones.find(
              (r) => r.ClienteIdClientes === selectedClient.CodigoCliente
            );
            const segundoTelefono = relacion?.Distribuidor?.SegundoTelefono;

            return (
              <div className="grid grid-cols-1 gap-4 p-4 bg-white rounded-lg shadow-lg text-sm">
                <h2 className="text-xl font-bold text-center col-span-full mb-2">
                  Detalles del Cliente
                </h2>

                <div className="flex justify-between">
                  <span className="font-medium">Razón Social:</span>
                  <span>{selectedClient.NombreCompleto}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Código Dumont:</span>
                  <div className="flex items-center gap-2">
                    <span>{selectedClient.CodigoDumont}</span>
                    <AiOutlineCopy
                      onClick={() => {
                        navigator.clipboard.writeText(
                          selectedClient.CodigoDumont
                        );
                        toast.info('📋 Código Dumont copiado', {
                          autoClose: 2000,
                          position: 'top-right',
                        });
                      }}
                      className="cursor-pointer text-blue-600 hover:text-blue-800"
                      title="Copiar código"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Teléfono (Cliente):</span>
                  <a
                    href={`tel:${selectedClient.Telefono}`}
                    className="text-green-600 hover:text-green-800 flex items-center gap-2"
                  >
                    {selectedClient.Telefono}
                    <AiOutlinePhone />
                  </a>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Permiso Venta Alcohol:</span>
                  <span>{selectedClient.VentaAlcohol === 1 ? 'Sí' : 'No'}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Segmentación:</span>
                  <span>
                    {selectedClient.Segmentacion || 'No especificado'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Condición Fiscal:</span>
                  <span>
                    {selectedClient.CondicionFiscal || 'No especificado'}
                  </span>
                </div>

                {segundoTelefono && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">WhatsApp Distribuidor:</span>
                    <a
                      href={`https://wa.me/${segundoTelefono}?text=${encodeURIComponent(
                        `Hola! Me contacto para consultarte acerca de un dispositivo asociado al cliente ${selectedClient.NombreCompleto} con código ${selectedClient.CodigoCliente}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 flex items-center gap-2"
                      title="Enviar WhatsApp"
                    >
                      {segundoTelefono}
                      <AiOutlinePhone />
                    </a>
                  </div>
                )}
              </div>
            );
          })()}
      </Modal>

      {/* Modal de multimedia */}
      <MultimediaModal
        isOpen={isMultimediaModalOpen}
        onClose={() => setIsMultimediaModalOpen(false)}
        device={currentMultimediaDevice}
      />

      {/* Modal Eliminar Dispositivo */}
      <ModalDelete
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={() => handleDelete(deviceToDelete.idDispositivos)}
      />
    </div>
  );
}

export default DeviceTable;
