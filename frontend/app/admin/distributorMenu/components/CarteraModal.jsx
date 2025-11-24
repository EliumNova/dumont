"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import axios from "axios";

export default function CarteraModal({ distribuidor, onClose }) {
  const [clientesCompletos, setClientesCompletos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!distribuidor) return;

    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/clientes`
        );
        const allClients = res.data.rows; // <-- Asegurate de usar .rows

        // Filtrar solo los clientes que pertenecen a este distribuidor
        const clientesFiltrados = allClients.filter((cliente) =>
          cliente.Distribuidores.some(
            (d) => d.NombreComercial === distribuidor.NombreComercial
          )
        );

        // Mapear los campos que queremos mostrar
        const clientesMapeados = clientesFiltrados.map((cliente) => ({
          NombreCompleto: cliente.NombreCompleto,
          CodigoCliente: cliente.CodigoCliente,
          Segmentacion: cliente.Segmentacion,
          Telefono: cliente.Telefono,
          Email: cliente.CorreoElectronico,
        }));

        setClientesCompletos(clientesMapeados);
      } catch (error) {
        console.error("Error al traer clientes:", error);
        setClientesCompletos([]); // Evita errores si falla la fetch
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [distribuidor]);

  if (!distribuidor) return null;

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="p-4 bg-white rounded shadow-lg max-h-[500px] overflow-y-auto text-black">
        <h3 className="text-lg font-bold mb-4 text-center">
          Cartera de Clientes de {distribuidor.NombreComercial}
        </h3>

        {loading ? (
          <p className="text-center text-gray-500">Cargando clientes...</p>
        ) : clientesCompletos.length > 0 ? (
          <table className="min-w-full text-left text-sm font-light whitespace-nowrap">
            <thead className="border-b font-medium text-black">
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Código Cliente</th>
                <th className="px-4 py-2">Segmentación</th>
                <th className="px-4 py-2">Teléfono</th>
                <th className="px-4 py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {clientesCompletos.map((cliente, index) => (
                <tr
                  key={index}
                  className="border-b text-black hover:bg-neutral-100">
                  <td className="px-4 py-2">{cliente.NombreCompleto}</td>
                  <td className="px-4 py-2">{cliente.CodigoCliente}</td>
                  <td className="px-4 py-2">{cliente.Segmentacion}</td>
                  <td className="px-4 py-2">{cliente.Telefono}</td>
                  <td className="px-4 py-2">{cliente.Email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">
            No hay clientes disponibles
          </p>
        )}

        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
