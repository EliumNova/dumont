// components/MultimediaModal.jsx
//
// Panel para subir imágenes/videos y elegir a qué pantallas se les manda:
// un dispositivo puntual, todo un distribuidor o todo un segmento.
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {
  FiCheck,
  FiFilm,
  FiLayers,
  FiMonitor,
  FiPlay,
  FiSend,
  FiTrash2,
  FiUploadCloud,
  FiUsers,
  FiX,
} from "react-icons/fi";
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

// Miniatura de un item de la biblioteca (imagen o primer cuadro del video).
function Miniatura({ item, className = "" }) {
  return item.tipo === "imagen" ? (
    <img
      src={item.url}
      alt={item.nombreArchivo || "imagen"}
      className={`object-cover w-full h-full ${className}`}
    />
  ) : (
    <video
      src={item.url}
      muted
      preload="metadata"
      className={`object-cover w-full h-full ${className}`}
    />
  );
}

function TarjetaDestino({
  icono: Icono,
  titulo,
  descripcion,
  activo,
  deshabilitado,
  onClick,
}) {
  return (
    <button
      type="button"
      disabled={deshabilitado}
      onClick={onClick}
      className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border-2 transition ${
        deshabilitado
          ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
          : activo
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-gray-300 bg-white"
      }`}
    >
      <span
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          activo ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
        }`}
      >
        <Icono size={18} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-semibold text-gray-900">{titulo}</span>
        <span className="block text-sm text-gray-500 truncate">
          {descripcion}
        </span>
      </span>
      <span
        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          activo ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300"
        }`}
      >
        {activo && <FiCheck size={12} />}
      </span>
    </button>
  );
}

function MultimediaModal({ isOpen, onClose, device }) {
  const [biblioteca, setBiblioteca] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subida, setSubida] = useState(null); // { nombre, progreso, actual, total }
  const [arrastrando, setArrastrando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [okMessage, setOkMessage] = useState("");
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
      setErrorMessage("");
      setOkMessage("");
    }
  }, [isOpen, cargarDatos]);

  // Cerrar con la tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const alTeclear = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [isOpen, onClose]);

  // Sube uno o varios archivos (desde el selector o arrastrados).
  const subirArchivos = async (archivos) => {
    const lista = Array.from(archivos || []);
    if (lista.length === 0) return;

    const validos = lista.filter(
      (f) => f.type.startsWith("image") || f.type.startsWith("video"),
    );
    if (validos.length !== lista.length) {
      setErrorMessage("Solo se aceptan imágenes o videos.");
      if (validos.length === 0) return;
    } else {
      setErrorMessage("");
    }
    setOkMessage("");

    try {
      for (let i = 0; i < validos.length; i++) {
        const file = validos[i];
        const esImagen = file.type.startsWith("image");
        setSubida({
          nombre: file.name,
          progreso: 0,
          actual: i + 1,
          total: validos.length,
        });

        const formData = new FormData();
        formData.append(esImagen ? "image" : "video", file);

        const resUpload = await axios.post(`${FILES}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            if (!e.total) return;
            setSubida((prev) =>
              prev
                ? { ...prev, progreso: Math.round((e.loaded * 100) / e.total) }
                : prev,
            );
          },
        });

        // /api/files/upload devuelve { urls: [...] } (usa upload.fields).
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
      }

      setOkMessage(
        validos.length === 1
          ? "Archivo subido a la biblioteca."
          : `${validos.length} archivos subidos a la biblioteca.`,
      );
      await cargarDatos();
    } catch (err) {
      console.error("Error subiendo archivo", err);
      setErrorMessage(
        err.response?.data?.message || "Error al subir el archivo.",
      );
      await cargarDatos();
    } finally {
      setSubida(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const alSoltar = (e) => {
    e.preventDefault();
    setArrastrando(false);
    if (!subida) subirArchivos(e.dataTransfer.files);
  };

  const toggleSeleccion = (idMultimedia) => {
    setOkMessage("");
    setSeleccionados((prev) =>
      prev.includes(idMultimedia)
        ? prev.filter((id) => id !== idMultimedia)
        : [...prev, idMultimedia],
    );
  };

  const handleEliminarMultimedia = async (idMultimedia) => {
    if (
      !window.confirm(
        "¿Eliminar este archivo de la biblioteca? También se quita de las pantallas donde esté asignado.",
      )
    )
      return;
    try {
      await axios.delete(`${MULTIMEDIA}/${idMultimedia}`, {
        headers: authHeaders(),
      });
      setSeleccionados((prev) => prev.filter((id) => id !== idMultimedia));
      await cargarDatos();
    } catch (err) {
      console.error("Error eliminando multimedia", err);
      setErrorMessage("No se pudo eliminar el contenido.");
    }
  };

  const hayDestino =
    destino.dispositivo || destino.distribuidor || destino.segmento;

  const handleEnviar = async () => {
    if (seleccionados.length === 0) {
      setErrorMessage("Elegí al menos un contenido para enviar.");
      return;
    }
    if (!hayDestino) {
      setErrorMessage("Elegí al menos un destino.");
      return;
    }

    setErrorMessage("");
    setOkMessage("");
    setEnviando(true);

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

      setOkMessage(
        `Enviado. Las pantallas lo reciben en unos segundos (se sincronizan solas).`,
      );
      setSeleccionados([]);
      await cargarDatos();
    } catch (err) {
      console.error("Error enviando a tablets", err);
      setErrorMessage(
        err.response?.data?.message || "No se pudo enviar el contenido.",
      );
    } finally {
      setEnviando(false);
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

  if (!isOpen) return null;

  const toggleDestino = (clave) =>
    setDestino((prev) => ({ ...prev, [clave]: !prev[clave] }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="flex w-full max-w-6xl max-h-[92vh] flex-col overflow-hidden rounded-2xl bg-white text-gray-900 shadow-2xl">
        {/* Encabezado */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-4">
          <div className="min-w-0">
            <h2 className="text-xl font-bold">Contenido para pantallas</h2>
            {device && (
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                <span className="font-medium text-gray-700">
                  {cliente?.NombreCompleto || "Sin cliente"}
                </span>
                <span>
                  {device.Marca} {device.Modelo}
                </span>
                <span className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-700">
                  {device.CodigoDumont}
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            title="Cerrar (Esc)"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Mensajes */}
        {(errorMessage || okMessage) && (
          <div className="px-6 pt-4">
            {errorMessage && (
              <div className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
                <span>{errorMessage}</span>
                <button
                  type="button"
                  onClick={() => setErrorMessage("")}
                  className="ml-3 text-red-400 hover:text-red-700"
                >
                  <FiX />
                </button>
              </div>
            )}
            {okMessage && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
                <FiCheck /> {okMessage}
              </div>
            )}
          </div>
        )}

        {/* Cuerpo */}
        <div className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto p-6 lg:grid-cols-5">
          {/* Izquierda: subir + biblioteca */}
          <div className="lg:col-span-3">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setArrastrando(true);
              }}
              onDragLeave={() => setArrastrando(false)}
              onDrop={alSoltar}
              onClick={() => !subida && fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
                arrastrando
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={(e) => subirArchivos(e.target.files)}
                disabled={!!subida}
              />
              {subida ? (
                <div className="w-full max-w-sm">
                  <p className="mb-2 truncate text-sm font-medium text-gray-700">
                    Subiendo {subida.actual} de {subida.total}: {subida.nombre}
                  </p>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{ width: `${subida.progreso}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {subida.progreso}%
                  </p>
                </div>
              ) : (
                <>
                  <FiUploadCloud size={32} className="text-blue-600" />
                  <p className="mt-2 font-semibold text-gray-800">
                    Arrastrá tus archivos acá o hacé clic para elegirlos
                  </p>
                  <p className="text-sm text-gray-500">
                    Imágenes y videos. Podés subir varios a la vez.
                  </p>
                </>
              )}
            </div>

            <div className="mb-3 mt-6 flex items-center justify-between">
              <h3 className="font-semibold">
                Biblioteca{" "}
                <span className="font-normal text-gray-500">
                  ({biblioteca.length})
                </span>
              </h3>
              {seleccionados.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSeleccionados([])}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Deseleccionar todo
                </button>
              )}
            </div>

            {loading && biblioteca.length === 0 ? (
              <p className="text-sm text-gray-500">Cargando...</p>
            ) : biblioteca.length === 0 ? (
              <p className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
                Todavía no subiste nada. Arrastrá un archivo arriba para
                empezar.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {biblioteca.map((item) => {
                  const marcado = seleccionados.includes(item.idMultimedia);
                  return (
                    <div
                      key={item.idMultimedia}
                      onClick={() => toggleSeleccion(item.idMultimedia)}
                      className={`group relative aspect-video cursor-pointer overflow-hidden rounded-xl bg-black ring-4 transition ${
                        marcado
                          ? "ring-blue-500"
                          : "ring-transparent hover:ring-gray-200"
                      }`}
                    >
                      <Miniatura item={item} />

                      {item.tipo === "video" && (
                        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                          <FiPlay size={10} /> VIDEO
                        </span>
                      )}

                      <span
                        className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-white shadow ${
                          marcado ? "bg-blue-600" : "bg-black/30"
                        }`}
                      >
                        {marcado && <FiCheck size={13} />}
                      </span>

                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent px-2 pb-1.5 pt-6">
                        <span className="truncate text-xs text-white">
                          {item.nombreArchivo || item.tipo}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEliminarMultimedia(item.idMultimedia);
                          }}
                          className="ml-2 rounded-md p-1 text-white/80 opacity-0 transition hover:bg-red-600 hover:text-white group-hover:opacity-100"
                          title="Eliminar de la biblioteca"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Derecha: destino + envío + asignado */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="mb-3 font-semibold">¿A qué pantallas lo enviamos?</h3>
              <div className="flex flex-col gap-2">
                <TarjetaDestino
                  icono={FiMonitor}
                  titulo="Solo esta pantalla"
                  descripcion={device?.CodigoDumont || "—"}
                  activo={destino.dispositivo}
                  onClick={() => toggleDestino("dispositivo")}
                />
                <TarjetaDestino
                  icono={FiUsers}
                  titulo="Todo el distribuidor"
                  descripcion={
                    cliente?.CodigoDistribuidor
                      ? `Distribuidor ${cliente.CodigoDistribuidor}`
                      : "Sin datos de distribuidor"
                  }
                  activo={destino.distribuidor}
                  deshabilitado={!cliente?.CodigoDistribuidor}
                  onClick={() => toggleDestino("distribuidor")}
                />
                <TarjetaDestino
                  icono={FiLayers}
                  titulo="Todo el segmento"
                  descripcion={
                    cliente?.Segmentacion
                      ? `Todos los ${cliente.Segmentacion}`
                      : "Sin datos de segmento"
                  }
                  activo={destino.segmento}
                  deshabilitado={!cliente?.Segmentacion}
                  onClick={() => toggleDestino("segmento")}
                />
              </div>

              <button
                type="button"
                onClick={handleEnviar}
                disabled={enviando || seleccionados.length === 0 || !hayDestino}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <FiSend />
                {enviando
                  ? "Enviando..."
                  : seleccionados.length === 0
                    ? "Elegí contenido de la biblioteca"
                    : `Enviar ${seleccionados.length} ${
                        seleccionados.length === 1 ? "archivo" : "archivos"
                      }`}
              </button>
            </div>

            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="mb-3 font-semibold">
                Ya asignado a esta pantalla{" "}
                <span className="font-normal text-gray-500">
                  ({asignacionesDeEsteDispositivo.length})
                </span>
              </h3>
              {asignacionesDeEsteDispositivo.length === 0 ? (
                <div className="flex flex-col items-center py-4 text-center text-sm text-gray-500">
                  <FiFilm size={22} className="mb-1 text-gray-400" />
                  Todavía no tiene contenido asignado.
                </div>
              ) : (
                <ul className="max-h-64 divide-y divide-gray-100 overflow-y-auto">
                  {asignacionesDeEsteDispositivo.map((a) => (
                    <li
                      key={a.idAsignacion}
                      className="flex items-center gap-3 py-2"
                    >
                      <div className="h-10 w-16 shrink-0 overflow-hidden rounded-md bg-black">
                        {a.Multimedia && <Miniatura item={a.Multimedia} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {a.Multimedia?.nombreArchivo || a.Multimedia?.tipo}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {a.CodigoDumont
                            ? "Directo a esta pantalla"
                            : a.CodigoDistribuidor
                              ? `Todo el distribuidor ${a.CodigoDistribuidor}`
                              : `Todo el segmento ${a.Segmentacion}`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleQuitarAsignacion(a.idAsignacion)}
                        className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        title="Quitar"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultimediaModal;
