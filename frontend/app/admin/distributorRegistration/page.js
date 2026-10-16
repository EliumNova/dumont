"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { DISTRIBUIDORES } from "@/lib/slices/constants";
import FormCard, { Seccion, BotonesForm, Aviso } from "../components/FormCard";
import Field from "../components/Field";
import AddressAutocomplete from "../components/AddressAutocomplete";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  validarFormulario,
  validarRequerido,
  validarEmail,
  validarTelefono,
  validarCUIT,
} from "@/lib/formato";

const INICIAL = {
  NombreComercial: "",
  RazonSocial: "",
  CodigoDistribuidor: "",
  CUIT: "",
  Email: "",
  Telefono: "",
  SegundoTelefono: "",
  Calle: "",
  EntreCalles: "",
  Localidad: "",
};

const REGLAS = {
  NombreComercial: (v) => validarRequerido(v, "El nombre comercial"),
  RazonSocial: (v) => validarRequerido(v, "La razón social"),
  CodigoDistribuidor: (v) => (/^\d{1,9}$/.test(String(v)) ? "" : "Ingresá un código numérico (hasta 9 dígitos)."),
  CUIT: validarCUIT,
  Email: validarEmail,
  Telefono: validarTelefono,
  SegundoTelefono: validarTelefono,
  Calle: (v) => validarRequerido(v, "La calle"),
  EntreCalles: (v) => validarRequerido(v, "Las entre calles"),
  Localidad: (v) => validarRequerido(v, "La localidad"),
};

function DistribuidorRegistration() {
  const router = useRouter();
  const [form, setForm] = useState(INICIAL);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState(false);

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrores((er) => ({ ...er, [name]: "" }));
    setErrorGeneral("");
  };

  // Al elegir una sugerencia se completan calle y localidad.
  const alElegirDireccion = (d) => {
    setForm((p) => ({
      ...p,
      Calle: [d.Calle, d.Altura].filter(Boolean).join(" "),
      Localidad: d.Localidad || p.Localidad,
    }));
    setErrores((er) => ({ ...er, Calle: "", Localidad: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validarFormulario(form, REGLAS);
    setErrores(errs);
    if (Object.keys(errs).length) return;

    setGuardando(true);
    try {
      // Teléfonos y CUIT se guardan solo con dígitos.
      await axios.post(`${DISTRIBUIDORES}/create`, {
        ...form,
        NombreComercial: form.NombreComercial.trim(),
        RazonSocial: form.RazonSocial.trim(),
        Email: form.Email.trim().toLowerCase(),
      });
      setExito(true);
      setForm(INICIAL);
    } catch (err) {
      setErrorGeneral(err.response?.data?.message || "No se pudo crear el distribuidor.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      <FormCard
        title="Registrar distribuidor"
        subtitle="Buscá la dirección para completar calle y localidad automáticamente."
        onBack={() => router.push("/admin")}
        maxWidth="max-w-4xl">
        <form onSubmit={handleSubmit} noValidate>
          <Aviso>{errorGeneral}</Aviso>

          <Seccion titulo="Datos del distribuidor">
            <Field label="Nombre comercial" name="NombreComercial" value={form.NombreComercial} error={errores.NombreComercial} onChange={cambiar} maxLength={45} />
            <Field label="Razón social" name="RazonSocial" value={form.RazonSocial} error={errores.RazonSocial} onChange={cambiar} maxLength={45} />
            <Field label="Código de distribuidor" name="CodigoDistribuidor" formato="numero" value={form.CodigoDistribuidor} error={errores.CodigoDistribuidor} onChange={cambiar} placeholder="Ej. 136008" />
            <Field label="CUIT" name="CUIT" formato="cuit" value={form.CUIT} error={errores.CUIT} onChange={cambiar} placeholder="20-12345678-9" />
          </Seccion>

          <Seccion titulo="Contacto">
            <Field label="Email" name="Email" type="email" value={form.Email} error={errores.Email} onChange={cambiar} maxLength={45} placeholder="ventas@distribuidor.com" />
            <Field label="Teléfono" name="Telefono" formato="telefono" value={form.Telefono} error={errores.Telefono} onChange={cambiar} placeholder="11 5555-5555" />
            <Field label="Teléfono del jefe de ventas" name="SegundoTelefono" formato="telefono" value={form.SegundoTelefono} error={errores.SegundoTelefono} onChange={cambiar} placeholder="11 5555-5555" className="sm:col-span-2" />
          </Seccion>

          <section className="mb-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Dirección</h3>
            <AddressAutocomplete onSelect={alElegirDireccion} className="mb-3" />
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
              <Field label="Calle y altura" name="Calle" value={form.Calle} error={errores.Calle} onChange={cambiar} maxLength={45} />
              <Field label="Localidad" name="Localidad" value={form.Localidad} error={errores.Localidad} onChange={cambiar} maxLength={45} />
              <Field label="Entre calles" name="EntreCalles" value={form.EntreCalles} error={errores.EntreCalles} onChange={cambiar} maxLength={45} placeholder="Ej. Mendoza y San Juan" className="sm:col-span-2" />
            </div>
          </section>

          <BotonesForm onCancel={() => router.push("/admin")} submitText="Guardar distribuidor" loading={guardando} />
        </form>
      </FormCard>

      <ConfirmDialog
        isOpen={exito}
        danger={false}
        icon="✓"
        hideCancel
        title="¡Distribuidor creado!"
        message="Ya figura en la lista de distribuidores."
        confirmText="Entendido"
        onConfirm={() => setExito(false)}
        onCancel={() => setExito(false)}
      />
    </>
  );
}

export default DistribuidorRegistration;
