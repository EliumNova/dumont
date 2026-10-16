// components/MultimediaModal.jsx
//
// Antes esto era un prototipo de "editor de video" (timeline, drag & drop de
// clips) que nunca llegó a subir ni guardar nada en el backend. Se reemplaza
// por lo que realmente pidió el cliente: subir una imagen o video, y elegir
// a qué tablets se les manda (un dispositivo puntual, todo un distribuidor,
// o todo un segmento).
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Modal from "./Modal";
import {
  FILES,
  MULTIMEDIA,
  MULTIMEDIA_ASIGNACIONES,
} from "@/lib/slices/constants";

const authHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

function MultimediaModal({ isOpen, onClose, device }) {
  const [biblioteca, setBiblioteca] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  const [seleccionados, setSeleccionados] = useState([]); // ids de Multimedia elegidos para enviar
  const [destino, setDestino] = useState({
    dispositivo: true,
    distribuidor: false,
    segmento: false,
  });

  const cliente = device?.Cliente || null;

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    try {
      const [resMedia, resAsignaciones] = await Promise.all([
        axios.get(MULTIMEDIA),
        axios.get(MULTIMEDIA_ASIGNACIONES),
      ]);
      setBiblioteca(resMedia.data || []);
      setAsignaciones(resAsignaciones.data || []);
    } catch (err) {
      console.error("Error cargando multimedia", err);
      setErrorMessage("No se pudo cargar la biblioteca multimedia.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      cargarDatos();
      setSeleccionados([]);
    }
  }, [isOpen, cargarDatos]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const esImagen = file.type.startsWith("image");
    const esVideo = file.type.startsWith("video");

    if (!esImagen && !esVideo) {
      setErrorMessage("Solo se aceptan imágenes o videos.");
      return;
    }

    setUploading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append(esImagen ? "image" : "video", file);

      const resUpload = await axios.post(`${FILES}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // OJO: /api/files/upload usa upload.fields([...]) en el backend, así
      // que siempre llena req.files (nunca req.file) y el controller
      // createFile devuelve { urls: [...] } (plural), nunca { url }.
      const url = resUpload.data?.urls?.[0] || resUpload.data?.url;
      if (!url) throw new Error("El servidor no devolvió una URL");

      await axios.post(
        MULTIMEDIA,
        {
          url,
          tipo: esImagen ? "imagen" : "video",
          nombreArchivo: file.name,
        },
        { headers: authHeaders() },
      );

      await cargarDatos();
    } catch (err) {
      console.error("Error subiendo archivo", err);
      setErrorMessage(
        err.response?.data?.message || "Error al subir el archivo.",
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toggleSeleccion = (idMultimedia) => {
    setSeleccionados((prev) =>
      prev.includes(idMultimedia)
        ? prev.filter((id) => id !== idMultimedia)
        : [...prev, idMultimedia],
    );
  };

  const handleEliminarMultimedia = async (idMultimedia) => {
    try {
      await axios.delete(`${MULTIMEDIA}/${idMultimedia}`, {
        headers: authHeaders(),
      });
      await cargarDatos();
    } catch (err) {
      console.error("Error eliminando multimedia", err);
      setErrorMessage("No se pudo eliminar el contenido.");
    }
  };

  const handleEnviar = async () => {
    if (seleccionados.length === 0) {
      setErrorMessage("Elegí al menos un contenido para enviar.");
      return;
    }
    if (!destino.dispositivo && !destino.distribuidor && !destino.segmento) {
      setErrorMessage("Elegí al menos un destino.");
      return;
    }

    setErrorMessage("");

    try {
      await Promise.all(
        seleccionados.map((MultimediaId) =>
          axios.post(
            MULTIMEDIA_ASIGNACIONES,
            {
              MultimediaId,
              dispositivos: destino.dispositivo ? [device.CodigoDumont] : [],
              distribuidores:
                destino.distribuidor && cliente?.CodigoDistribuidor
                  ? [cliente.CodigoDistribuidor]
                  : [],
              segmentos:
                destino.segmento && cliente?.Segmentacion
                  ? [cliente.Segmentacion]
                  : [],
            },
            { headers: authHeaders() },
          ),
        ),
      );

      setSeleccionados([]);
      await cargarDatos();
    } catch (err) {
      console.error("Error enviando a tablets", err);
      setErrorMessage(
        err.response?.data?.message || "No se pudo enviar el contenido.",
      );
    }
  };

  const handleQuitarAsignacion = async (idAsignacion) => {
    try {
      await axios.delete(`${MULTIMEDIA_ASIGNACIONES}/${idAsignacion}`, {
        headers: authHeaders(),
      });
      await cargarDatos();
    } catch (err) {
      console.error("Error quitando asignación", err);
      setErrorMessage("No se pudo quitar la asignación.");
    }
  };

  // Asignaciones que aplican a ESTE dispositivo puntual (por CodigoDumont,
  // por su distribuidor, o por su segmento), para mostrar "qué le llega hoy".
  const asignacionesDeEsteDispositivo = asignaciones.filter((a) => {
    if (!device) return false;
    return (
      a.CodigoDumont === device.CodigoDumont ||
      (cliente?.CodigoDistribuidor &&
        a.CodigoDistribuidor === cliente.CodigoDistribuidor) ||
      (cliente?.Segmentacion && a.Segmentacion === cliente.Segmentacion)
    );
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-black max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-1">Multimedia para tablets</h2>
        {device && (
          <p className="text-sm text-gray-500 mb-4">
            Dispositivo: {device.Marca} {device.Modelo} — Código Dumont:{" "}
            <strong>{device.CodigoDumont}</strong>
            {cliente && (
              <>
                {" "}
                · Distribuidor: {cliente.CodigoDistribuidor || "—"} · Segmento:{" "}
                {cliente.Segmentacion || "—"}
              </>
            )}
          </p>
        )}

        {errorMessage && (
          <div className="p-2 mb-4 text-sm rounded bg-red-100 text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Subir contenido nuevo */}
        <div className="mb-6 p-4 border-2 border-dashed rounded-lg border-gray-300">
          <label className="block font-semibold mb-2">
            Subir imagen o video nuevo
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading && (
            <p className="text-sm text-gray-500 mt-2">Subiendo archivo...</p>
          )}
        </div>

        {/* Biblioteca */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">
            Biblioteca ({biblioteca.length})
          </h3>
          {loading ? (
            <p className="text-sm text-gray-500">Cargando...</p>
          ) : biblioteca.length === 0 ? (
            <p className="text-sm text-gray-500">
              Todavía no subiste nada. Usá el campo de arriba.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {biblioteca.map((item) => {
                const marcado = seleccionados.includes(item.idMultimedia);
                return (
                  <div
                    key={item.idMultimedia}
                    onClick={() => toggleSeleccion(item.idMultimedia)}
                    className={`relative cursor-pointer rounded-md overflow-hidden border-4 aspect-video bg-black ${
                      marcado ? "border-blue-500" : "border-transparent"
                    }`}>
                    {item.tipo === "imagen" ? (
                      <img
                        src={item.url}
                        alt={item.nombreArchivo || "imagen"}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <video
                        src={item.url}
                        muted
                        preload="metadata"
                        className="object-cover w-full h-full"
                      />
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEliminarMultimedia(item.idMultimedia);
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      title="Eliminar de la biblioteca">
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Destino y envío */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">¿A quién se lo mandamos?</h3>
          <div className="flex flex-col gap-2 mb-3 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={destino.dispositivo}
                onChange={(e) =>
                  setDestino((prev) => ({
                    ...prev,
                    dispositivo: e.target.checked,
                  }))
                }
              />
              Solo este dispositivo ({device?.CodigoDumont})
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                disabled={!cliente?.CodigoDistribuidor}
                checked={destino.distribuidor}
                onChange={(e) =>
                  setDestino((prev) => ({
                    ...prev,
                    distribuidor: e.target.checked,
                  }))
                }
              />
              Todo el distribuidor ({cliente?.CodigoDistribuidor || "sin datos"}
              )
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                disabled={!cliente?.Segmentacion}
                checked={destino.segmento}
                onChange={(e) =>
                  setDestino((prev) => ({
                    ...prev,
                    segmento: e.target.checked,
                  }))
                }
              />
              Todo el segmento ({cliente?.Segmentacion || "sin datos"})
            </label>
          </div>

          <button
            type="button"
            onClick={handleEnviar}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Enviar ({seleccionados.length} seleccionado
            {seleccionados.length === 1 ? "" : "s"})
          </button>
        </div>

        {/* Lo que ya le llega a este dispositivo */}
        <div>
          <h3 className="font-semibold mb-2">
            Contenido asignado a este dispositivo
          </h3>
          {asignacionesDeEsteDispositivo.length === 0 ? (
            <p className="text-sm text-gray-500">
              Todavía no tiene contenido asignado.
            </p>
          ) : (
            <ul className="divide-y">
              {asignacionesDeEsteDispositivo.map((a) => (
                <li
                  key={a.idAsignacion}
                  className="flex items-center justify-between py-2 text-sm">
                  <span>
                    {a.Multimedia?.nombreArchivo || a.Multimedia?.tipo} —{" "}
                    {a.CodigoDumont
                      ? "directo a este dispositivo"
                      : a.CodigoDistribuidor
                        ? `todo el distribuidor ${a.CodigoDistribuidor}`
                        : `todo el segmento ${a.Segmentacion}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuitarAsignacion(a.idAsignacion)}
                    className="text-red-600 hover:underline">
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default MultimediaModal;
