"use client";
import { setPrincipales } from "@/lib/slices/clients/clientSlice";
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Field from "../../components/Field";
import { BotonesForm, Seccion } from "../../components/FormCard";
import {
  validarFormulario,
  validarRequerido,
  validarEmail,
  validarTelefono,
} from "@/lib/formato";

const REGLAS = {
  NombreCompleto: (v) => validarRequerido(v, "El nombre"),
  CodigoCliente: (v) => (/^\d{1,4}$/.test(String(v)) ? "" : "Ingresá el código (hasta 4 dígitos)."),
  CodigoDistribuidor: (v) => validarRequerido(v, "El distribuidor"),
  Segmentacion: (v) => validarRequerido(v, "La segmentación"),
  CorreoElectronico: validarEmail,
  Telefono: validarTelefono,
  CondicionFiscal: (v) => validarRequerido(v, "La condición fiscal"),
  VentaAlcohol: (v) => (v === "" || v === undefined ? "Indicá si tiene permiso." : ""),
};

// Código DuMont = código de distribuidor + ceros + código de cliente (14 dígitos).
const generarCodigoDumont = (distribuidor, cliente) => {
  const d = String(distribuidor || "");
  const c = String(cliente || "");
  if (!d || !c) return "";
  const ceros = 14 - (d.length + c.length);
  if (ceros < 0) return "";
  return `${d}${"0".repeat(ceros)}${c}`.slice(0, 14);
};

function Principales({ onNext, onBack }) {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.clients.newCustomer.principales);

  const [info, setInfo] = useState({
    NombreCompleto: store?.NombreCompleto || "",
    CodigoCliente: store?.CodigoCliente || "",
    Segmentacion: store?.Segmentacion || "",
    CodigoDistribuidor: store?.CodigoDistribuidor || "",
    CorreoElectronico: store?.CorreoElectronico || "",
    VentaAlcohol: store?.VentaAlcohol ?? "",
    Telefono: store?.Telefono || "",
    CondicionFiscal: store?.CondicionFiscal || "",
  });
  const [distribuidores, setDistribuidores] = useState([]);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/clientes/distribuidores/list`)
      .then((r) => setDistribuidores(r.data || []))
      .catch((e) => console.error("Error al obtener los distribuidores:", e));
  }, []);

  const codigoDumont = useMemo(
    () => generarCodigoDumont(info.CodigoDistribuidor, info.CodigoCliente),
    [info.CodigoDistribuidor, info.CodigoCliente]
  );

  const cambiar = (e) => {
    const { name, value } = e.target;
    setInfo((p) => {
      const sig = { ...p, [name]: value };
      // Responsable Inscripto: el permiso de alcohol queda en "Sí" y bloqueado.
      if (name === "CondicionFiscal") sig.VentaAlcohol = value === "RI" ? "1" : p.VentaAlcohol === "1" ? "0" : p.VentaAlcohol;
      return sig;
    });
    setErrores((er) => ({ ...er, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validarFormulario(info, REGLAS);
    if (!codigoDumont && info.CodigoDistribuidor && info.CodigoCliente) {
      errs.CodigoCliente = "El código resultante supera los 14 dígitos.";
    }
    setErrores(errs);
    if (Object.keys(errs).length) return;

    dispatch(
      setPrincipales({
        ...info,
        VentaAlcohol: Number(info.VentaAlcohol),
        CodigoDumont: codigoDumont,
      })
    );
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Seccion titulo="Cliente">
        <Field label="Nombre completo" name="NombreCompleto" value={info.NombreCompleto} error={errores.NombreCompleto} onChange={cambiar} maxLength={60} placeholder="Nombre del negocio o titular" />
        <Field label="Código de cliente" name="CodigoCliente" formato="numero" value={info.CodigoCliente} error={errores.CodigoCliente} onChange={(e) => cambiar({ target: { name: "CodigoCliente", value: e.target.value.slice(0, 4) } })} placeholder="Ej. 1002" />
        <Field label="Correo electrónico" name="CorreoElectronico" type="email" value={info.CorreoElectronico} error={errores.CorreoElectronico} onChange={cambiar} maxLength={60} placeholder="negocio@dominio.com" />
        <Field label="Teléfono" name="Telefono" formato="telefono" value={info.Telefono} error={errores.Telefono} onChange={cambiar} placeholder="11 5555-5555" />
      </Seccion>

      <Seccion titulo="Clasificación">
        <Field
          label="Distribuidor"
          name="CodigoDistribuidor"
          value={info.CodigoDistribuidor}
          error={errores.CodigoDistribuidor}
          onChange={cambiar}
          options={[
            { value: "", label: "Seleccioná un distribuidor…" },
            ...distribuidores.map((d) => ({
              value: String(d.CodigoDistribuidor),
              label: `${d.CodigoDistribuidor} — ${d.NombreComercial}`,
            })),
          ]}
        />
        <Field
          label="Segmentación"
          name="Segmentacion"
          value={info.Segmentacion}
          error={errores.Segmentacion}
          onChange={cambiar}
          options={[
            { value: "", label: "Seleccioná…" },
            { value: "Kiosco", label: "Kiosco" },
            { value: "Almacen", label: "Almacén" },
            { value: "Autoservicio", label: "Autoservicio" },
          ]}
        />
        <Field
          label="Condición fiscal"
          name="CondicionFiscal"
          value={info.CondicionFiscal}
          error={errores.CondicionFiscal}
          onChange={cambiar}
          options={[
            { value: "", label: "Seleccioná…" },
            { value: "CF", label: "Consumidor final" },
            { value: "RI", label: "Responsable inscripto" },
            { value: "MT", label: "Monotributista" },
          ]}
        />
        <Field
          label="Permiso de venta de alcohol"
          name="VentaAlcohol"
          value={String(info.VentaAlcohol)}
          error={errores.VentaAlcohol}
          onChange={cambiar}
          disabled={info.CondicionFiscal === "RI"}
          hint={info.CondicionFiscal === "RI" ? "Los responsables inscriptos tienen permiso automático." : undefined}
          options={[
            { value: "", label: "Seleccioná…" },
            { value: "1", label: "Sí" },
            { value: "0", label: "No" },
          ]}
        />
        <div className="rounded-2xl bg-blue-50 px-4 py-3 sm:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wide text-blue-600">Código DuMont (automático)</p>
          <p className="mt-0.5 font-mono text-lg font-semibold tracking-wider text-blue-900">
            {codigoDumont || "Se genera al elegir distribuidor y código de cliente"}
          </p>
        </div>
      </Seccion>

      <BotonesForm onCancel={onBack} submitText="Siguiente" />
    </form>
  );
}

export default Principales;
