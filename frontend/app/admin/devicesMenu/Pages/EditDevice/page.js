"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { CLIENTS, DISPOSITIVOS } from "@/lib/slices/constants";

const campoCls =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

function EditDeviceForm() {
  const router = useRouter();
  const id = useSearchParams().get("id");

  const [form, setForm] = useState({
    Marca: "",
    Modelo: "",
    NumSerie: "",
    CodigoCliente: "",
    HorarioPublicitario: "",
  });
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Falta el id del dispositivo.");
      setCargando(false);
      return;
    }
    let cancelado = false;
    (async () => {
      try {
        const [disp, cli] = await Promise.all([
          axios.get(`${DISPOSITIVOS}/${id}`),
          axios.get(CLIENTS, { params: { page: 0, pageSize: 10000 } }),
        ]);
        if (cancelado) return;
        const d = disp.data;
        if (!d) {
          setError("No se encontró el dispositivo.");
        } else {
          setForm({
            Marca: d.Marca || "",
            Modelo: d.Modelo || "",
            NumSerie: d.NumSerie || "",
            CodigoCliente: d.CodigoCliente || "",
            HorarioPublicitario: d.HorarioPublicitario || "",
          });
        }
        setClientes(cli.data?.rows || []);
      } catch {
        if (!cancelado) setError("No se pudo cargar el dispositivo.");
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [id]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const guardar = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");
    if (!form.Marca.trim() || !form.Modelo.trim() || !form.NumSerie.trim()) {
      setError("Marca, modelo y número de serie son obligatorios.");
      return;
    }
    setGuardando(true);
    try {
      await axios.put(`${DISPOSITIVOS}/update/${id}`, {
        Marca: form.Marca.trim(),
        Modelo: form.Modelo.trim(),
        NumSerie: form.NumSerie.trim(),
        CodigoCliente: form.CodigoCliente || undefined,
        HorarioPublicitario: form.HorarioPublicitario.trim() || null,
      });
      setOk("Dispositivo actualizado.");
      setTimeout(() => router.push("/admin"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo guardar el dispositivo.");
    } finally {
      setGuardando(false);
    }
  };

  const liberarEnlace = async () => {
    setError("");
    setOk("");
    try {
      await axios.post(`${DISPOSITIVOS}/${id}/liberar-sesion`);
      setOk("Enlace liberado: cualquier dispositivo puede abrirlo ahora.");
    } catch {
      setError("No se pudo liberar el enlace.");
    }
  };

  return (
    // El Navbar ya lo pone app/admin/layout.js.
    <div className="h-full overflow-y-auto">
      <main className="mx-auto max-w-2xl p-4 sm:p-8">
        <form
          onSubmit={guardar}
          className="mac-fade-up flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-lg sm:p-8">
          <h1 className="text-2xl font-semibold text-[#191920]">Editar dispositivo</h1>

          {cargando ? (
            <p className="text-sm text-gray-500">Cargando…</p>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  Marca
                  <input name="Marca" value={form.Marca} onChange={handleChange} maxLength={45} className={campoCls} />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  Modelo
                  <input name="Modelo" value={form.Modelo} onChange={handleChange} maxLength={45} className={campoCls} />
                </label>
              </div>
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Número de serie
                <input name="NumSerie" value={form.NumSerie} onChange={handleChange} maxLength={45} className={campoCls} />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Cliente
                <select name="CodigoCliente" value={form.CodigoCliente} onChange={handleChange} className={campoCls}>
                  <option value="">— Sin cliente —</option>
                  {clientes.map((c) => (
                    <option key={c.idClientes} value={c.CodigoCliente}>
                      {c.NombreCompleto} ({c.CodigoCliente})
                    </option>
                  ))}
                </select>
                <span className="text-xs font-normal text-gray-500">
                  Al cambiar de cliente se actualizan el Código DuMont y la ubicación.
                </span>
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Horario publicitario
                <input
                  name="HorarioPublicitario"
                  value={form.HorarioPublicitario}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="Ej. 08:00-22:00 (vacío: usa el horario del cliente)"
                  className={campoCls}
                />
              </label>
              <div className="flex flex-col gap-2 rounded-2xl bg-gray-50 p-4">
                <p className="text-sm font-medium">Enlace de la pantalla</p>
                <p className="text-xs text-gray-500">
                  El enlace solo puede estar abierto en un dispositivo a la vez. Si
                  cambiaste la tablet y no se libera sola, liberalo desde acá.
                </p>
                <button
                  type="button"
                  onClick={liberarEnlace}
                  className="mac-press self-start rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-100">
                  Liberar enlace
                </button>
              </div>
            </>
          )}

          {error && <p className="mac-shake rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
          {ok && <p className="rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">{ok}</p>}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => router.push("/admin")} className="mac-press rounded-xl border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit" disabled={guardando || cargando || !id} className="mac-press rounded-xl bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60">
              {guardando ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function EditDevicePage() {
  return (
    <Suspense fallback={null}>
      <EditDeviceForm />
    </Suspense>
  );
}
