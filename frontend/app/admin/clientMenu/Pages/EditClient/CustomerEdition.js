"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { setLoading, setError } from "@/lib/slices/clients/clientSlice";
import CompleteModal from "../../components/CompleteModal_Update";
import Field from "../../../components/Field";

function CustomerEdition() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [showModal, setShowModal] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    principales: {
      NombreCompleto: "",
      CodigoCliente: "",
      Segmentacion: "",
      CondicionFiscal: "",
      CodigoDistribuidor: "",
      CorreoElectronico: "",
      Telefono: "",
      VentaAlcohol: false,
    },
    ubicacion: {
      Localidad: "",
      Calle: "",
      Altura: "",
      EntreCalle1: "",
      EntreCalle2: "",
      Latitud: "",
      Longitud: "",
    },
    horus: {
      tipo: "corrido",
      desde1: "",
      hasta1: "",
      desde2: "",
      hasta2: "",
    },
  });

  const loading = useSelector((state) => state.clients.newCustomer.loading);

  // 🔥 Parseo horario
  const parseHorario = (horario) => {
    if (!horario) return {};

    if (horario.includes("/")) {
      const [t1, t2] = horario.split(" / ");
      const [desde1, hasta1] = t1.split(" - ");
      const [desde2, hasta2] = t2.split(" - ");

      return { tipo: "doble", desde1, hasta1, desde2, hasta2 };
    } else {
      const [desde1, hasta1] = horario.split(" - ");
      return { tipo: "corrido", desde1, hasta1 };
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchCustomerData = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/clientes/${id}`,
        );

        const data = res.data;
        const horario = parseHorario(data.HorarioVenta);

        setCustomerInfo({
          principales: {
            NombreCompleto: data.NombreCompleto ?? "",
            CodigoCliente: data.CodigoCliente ?? "",
            Segmentacion: data.Segmentacion ?? "",
            CondicionFiscal: data.CondicionFiscal ?? "",
            CodigoDistribuidor: data.CodigoDistribuidor ?? "",
            CorreoElectronico: data.CorreoElectronico ?? "",
            Telefono: data.Telefono ?? "",
            VentaAlcohol: Boolean(data.VentaAlcohol),
          },
          ubicacion: {
            Localidad: data.Localidad ?? "",
            Calle: data.Calle ?? "",
            Altura: data.Altura ?? "",
            EntreCalle1: data.EntreCalle1 ?? "",
            EntreCalle2: data.EntreCalle2 ?? "",
            Latitud: data.Latitud ?? "",
            Longitud: data.Longitud ?? "",
          },
          horus: {
            tipo: horario.tipo || "corrido",
            desde1: horario.desde1 || "",
            hasta1: horario.hasta1 || "",
            desde2: horario.desde2 || "",
            hasta2: horario.hasta2 || "",
          },
        });
      } catch (error) {
        dispatch(setError("Error al cargar cliente"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCustomerData();
  }, [id, dispatch]);

  const handleChange = (section, field, value) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const buildHorario = () => {
    const { tipo, desde1, hasta1, desde2, hasta2 } = customerInfo.horus;

    if (tipo === "doble") {
      return `${desde1} - ${hasta1} / ${desde2} - ${hasta2}`;
    }
    return `${desde1} - ${hasta1}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      NombreCompleto: customerInfo.principales.NombreCompleto,
      CodigoCliente: customerInfo.principales.CodigoCliente,
      Segmentacion: customerInfo.principales.Segmentacion,
      CondicionFiscal: customerInfo.principales.CondicionFiscal,
      CodigoDistribuidor: customerInfo.principales.CodigoDistribuidor,
      CorreoElectronico: customerInfo.principales.CorreoElectronico,

      // 🔥 FIX 1: BOOLEAN REAL
      VentaAlcohol: customerInfo.principales.VentaAlcohol,

      Telefono: String(customerInfo.principales.Telefono),

      // Estos nombres deben coincidir tal cual con el modelo del backend
      // (mayúsculas incluidas). Antes se mandaban en minúscula pensando que
      // era el fix correcto, pero el modelo espera Localidad/Calle/Altura/
      // EntreCalle1/EntreCalle2, así que la dirección nunca se guardaba.
      Localidad: customerInfo.ubicacion.Localidad,
      Calle: customerInfo.ubicacion.Calle,
      Altura: String(customerInfo.ubicacion.Altura),
      EntreCalle1: customerInfo.ubicacion.EntreCalle1,
      EntreCalle2: customerInfo.ubicacion.EntreCalle2,
      Latitud: customerInfo.ubicacion.Latitud,
      Longitud: customerInfo.ubicacion.Longitud,

      HorarioVenta: buildHorario(),
    };


    try {
      dispatch(setLoading(true));

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clientes/update/${id}`,
        payload,
      );

      setShowModal(true);
      router.push("/admin");
    } catch (error) {
      console.error(error.response?.data);
      dispatch(setError(error.response?.data));
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (loading) return <div className="p-6 text-sm text-gray-500">Cargando...</div>;

  const p = customerInfo.principales;
  const u = customerInfo.ubicacion;
  const h = customerInfo.horus;
  const set = (sec, campo) => (e) => handleChange(sec, campo, e.target.value);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 sm:px-8 sm:py-5">
      <h2 className="text-xl font-semibold text-[#191920]">Edición de clientes</h2>

      <section className="mac-fade-up flex flex-col gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Principales</h3>
        <div className="grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Nombre" value={p.NombreCompleto} onChange={set("principales", "NombreCompleto")} required />
          <Field label="Código cliente" value={p.CodigoCliente} onChange={set("principales", "CodigoCliente")} required />
          <Field label="Segmentación" value={p.Segmentacion} onChange={set("principales", "Segmentacion")} required />
          <Field label="Condición fiscal" value={p.CondicionFiscal} onChange={set("principales", "CondicionFiscal")} required />
          <Field label="Código distribuidor" value={p.CodigoDistribuidor} onChange={set("principales", "CodigoDistribuidor")} required />
          <Field label="Email" type="email" value={p.CorreoElectronico} onChange={set("principales", "CorreoElectronico")} required />
          <Field label="Teléfono" inputMode="tel" value={p.Telefono} onChange={set("principales", "Telefono")} required />
          <label className="flex items-center gap-2 self-end pb-2.5 text-sm font-medium text-[#191920]">
            <input
              type="checkbox"
              className="h-4 w-4 accent-blue-500"
              checked={p.VentaAlcohol}
              onChange={(e) => handleChange("principales", "VentaAlcohol", e.target.checked)}
            />
            Venta de alcohol
          </label>
        </div>
      </section>

      <section className="mac-fade-up flex flex-col gap-2" style={{ animationDelay: "60ms" }}>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Ubicación</h3>
        <div className="grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Localidad" value={u.Localidad} onChange={set("ubicacion", "Localidad")} required />
          <Field label="Calle" value={u.Calle} onChange={set("ubicacion", "Calle")} required />
          <Field label="Altura" value={u.Altura} onChange={set("ubicacion", "Altura")} required />
          <Field label="Entre calle 1" value={u.EntreCalle1} onChange={set("ubicacion", "EntreCalle1")} required />
          <Field label="Entre calle 2" value={u.EntreCalle2} onChange={set("ubicacion", "EntreCalle2")} required />
          
          <Field label="Latitud (respaldo mapa)" value={u.Latitud} onChange={set("ubicacion", "Latitud")} />
          <Field label="Longitud (respaldo mapa)" value={u.Longitud} onChange={set("ubicacion", "Longitud")} />
        </div>
      </section>

      <section className="mac-fade-up flex flex-col gap-2" style={{ animationDelay: "120ms" }}>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Horario</h3>
        <div className="grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <Field
            label="Tipo"
            value={h.tipo}
            onChange={set("horus", "tipo")}
            options={[
              { value: "corrido", label: "Corrido" },
              { value: "doble", label: "Doble turno" },
            ]}
          />
          <Field type="time" label="Desde" value={h.desde1} onChange={set("horus", "desde1")} required />
          <Field type="time" label="Hasta" value={h.hasta1} onChange={set("horus", "hasta1")} required />
          {h.tipo === "doble" && (
            <>
              <Field type="time" label="Desde (tarde)" value={h.desde2} onChange={set("horus", "desde2")} required />
              <Field type="time" label="Hasta (tarde)" value={h.hasta2} onChange={set("horus", "hasta2")} required />
            </>
          )}
        </div>
      </section>

      <div className="flex justify-end gap-3 border-t border-black/5 pt-3">
        <button type="button" onClick={() => router.push("/admin/clientMenu")} className="mac-press rounded-xl border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-gray-100">
          Cancelar
        </button>
        <button type="submit" className="mac-press rounded-xl bg-blue-500 px-6 py-2 text-sm font-medium text-white hover:bg-blue-600">
          Guardar
        </button>
      </div>

      {showModal && <CompleteModal setShowModal={setShowModal} />}
    </form>
  );
}

export default CustomerEdition;
