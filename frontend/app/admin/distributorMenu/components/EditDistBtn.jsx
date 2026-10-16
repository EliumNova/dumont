"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  distribuidorUpdate,
  distribuidorDelete,
} from "@/lib/slices/distribuidores/distribuidorAction";
import { AiOutlineEdit } from "react-icons/ai";
import MacModal from "../../components/MacModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import Field from "../../components/Field";

const VACIO = {
  NombreComercial: "",
  RazonSocial: "",
  Calle: "",
  EntreCalles: "",
  Localidad: "",
  Email: "",
  Telefono: "",
  SegundoTelefono: "",
};

function EditDistBtn({ datos, onEditComplete }) {
  const dispatch = useDispatch();
  const [abierto, setAbierto] = useState(false);
  const [confirmar, setConfirmar] = useState(null); // 'descartar' | 'eliminar'
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState("");

  const abrir = () => {
    setForm(
      Object.fromEntries(Object.keys(VACIO).map((k) => [k, datos[k] || ""]))
    );
    setError("");
    setAbierto(true);
  };

  const cerrar = () => {
    setConfirmar(null);
    setAbierto(false);
    onEditComplete?.(); // vuelve a pedir la tabla
  };

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const guardar = async (e) => {
    e.preventDefault();
    if (Object.values(form).some((v) => !String(v).trim())) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.Email.trim())) {
      setError("El correo no es válido.");
      return;
    }
    await dispatch(distribuidorUpdate(datos.idDistribuidor, form));
    cerrar();
  };

  const eliminar = async () => {
    await dispatch(distribuidorDelete(datos.idDistribuidor));
    cerrar();
  };

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        aria-label="Editar distribuidor"
        className="mac-press flex items-center justify-center rounded-lg p-1 text-2xl hover:bg-black/5">
        <AiOutlineEdit />
      </button>

      <MacModal
        isOpen={abierto}
        onClose={() => setConfirmar("descartar")}
        title="Editar distribuidor"
        footer={false}
        maxWidth="max-w-2xl">
        <form onSubmit={guardar} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre comercial" name="NombreComercial" value={form.NombreComercial} onChange={handleChange} />
            <Field label="Razón social" name="RazonSocial" value={form.RazonSocial} onChange={handleChange} />
            <Field label="Calle" name="Calle" value={form.Calle} onChange={handleChange} />
            <Field label="Entre calles" name="EntreCalles" value={form.EntreCalles} onChange={handleChange} />
            <Field label="Localidad" name="Localidad" value={form.Localidad} onChange={handleChange} />
            <Field label="Email" name="Email" type="email" placeholder="distribuidor@email.com" value={form.Email} onChange={handleChange} />
            <Field label="Teléfono" name="Telefono" inputMode="tel" value={form.Telefono} onChange={handleChange} />
            <Field label="Teléfono (jefe de ventas)" name="SegundoTelefono" inputMode="tel" value={form.SegundoTelefono} onChange={handleChange} />
          </div>
          {error && <p className="mac-shake rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={() => setConfirmar("eliminar")} className="mac-press rounded-xl px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
              Eliminar distribuidor
            </button>
            <div className="flex gap-3">
              <button type="button" onClick={() => setConfirmar("descartar")} className="mac-press rounded-xl border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-gray-100">
                Cancelar
              </button>
              <button type="submit" className="mac-press rounded-xl bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-600">
                Guardar
              </button>
            </div>
          </div>
        </form>
      </MacModal>

      <ConfirmDialog
        isOpen={confirmar === "descartar"}
        title="¿Descartar los cambios?"
        message="Se perderá lo que editaste."
        confirmText="Descartar"
        onCancel={() => setConfirmar(null)}
        onConfirm={cerrar}
      />
      <ConfirmDialog
        isOpen={confirmar === "eliminar"}
        title="Eliminar distribuidor"
        message={`¿Seguro que querés eliminar a ${datos.NombreComercial}? No se puede deshacer.`}
        confirmText="Eliminar"
        onCancel={() => setConfirmar(null)}
        onConfirm={eliminar}
      />
    </>
  );
}

export default EditDistBtn;
