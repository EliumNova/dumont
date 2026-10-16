"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userUpdate, usuarioDelete } from "@/lib/slices/users/userAction";
import { FiEdit2 } from "react-icons/fi";
import MacModal from "../../components/MacModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import Field from "../../components/Field";
import { soloDigitos, validarDNI, validarTelefono } from "@/lib/formato";

function EditUserBtn({ datos, onCloseModal }) {
  const dispatch = useDispatch();
  const yo = useSelector((s) => s.auth.user);
  const esYo = !!yo && (yo.id === datos.idUsuarios || yo.idUsuarios === datos.idUsuarios);

  const [abierto, setAbierto] = useState(false);
  const [confirmar, setConfirmar] = useState(null); // 'descartar' | 'eliminar'
  const [form, setForm] = useState({ Name: "", Email: "", DNI: "", Telefono: "", isAdmin: false });
  const [error, setError] = useState("");

  const abrir = () => {
    setForm({
      Name: datos.Name || "",
      Email: datos.Email || "",
      DNI: soloDigitos(datos.DNI),
      Telefono: soloDigitos(datos.Telefono),
      isAdmin: !!datos.isAdmin,
    });
    setError("");
    setAbierto(true);
  };

  const cerrar = () => {
    setConfirmar(null);
    setAbierto(false);
    onCloseModal?.();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === "isAdmin" ? value === "true" : value }));
  };

  const guardar = async (e) => {
    e.preventDefault();
    if (!form.Name.trim() || !form.Email.trim() || !form.DNI) {
      setError("Nombre, correo y DNI son obligatorios.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.Email.trim())) {
      setError("El correo no es válido.");
      return;
    }
    const errDni = validarDNI(form.DNI);
    if (errDni) return setError(errDni);
    if (form.Telefono && validarTelefono(form.Telefono)) return setError(validarTelefono(form.Telefono));
    const payload = {
      Name: form.Name.trim(),
      Email: form.Email.trim(),
      DNI: Number(form.DNI),
      isAdmin: form.isAdmin,
    };
    if (form.Telefono) payload.Telefono = form.Telefono;
    await dispatch(userUpdate(datos.idUsuarios, payload));
    cerrar();
  };

  const eliminar = async () => {
    await dispatch(usuarioDelete(datos.idUsuarios));
    cerrar();
  };

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        aria-label="Editar usuario"
        className="mac-press rounded-lg p-2 text-gray-600 hover:bg-black/5">
        <FiEdit2 />
      </button>

      <MacModal
        isOpen={abierto}
        onClose={() => setConfirmar("descartar")}
        title="Editar usuario"
        footer={false}
        maxWidth="max-w-xl">
        <form onSubmit={guardar} className="flex flex-col gap-4">
          <Field label="Nombre completo" name="Name" value={form.Name} onChange={handleChange} maxLength={45} />
          <Field label="Correo electrónico" name="Email" type="email" value={form.Email} onChange={handleChange} maxLength={45} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="DNI" name="DNI" formato="dni" value={form.DNI} onChange={handleChange} />
            <Field label="Teléfono" name="Telefono" formato="telefono" value={form.Telefono} onChange={handleChange} />
          </div>
          <Field
            label="Rol administrador"
            name="isAdmin"
            value={form.isAdmin ? "true" : "false"}
            onChange={handleChange}
            disabled={esYo}
            options={[
              { value: "false", label: "No" },
              { value: "true", label: "Sí" },
            ]}
          />
          {esYo && <p className="-mt-2 text-xs text-gray-500">No podés cambiar tu propio rol.</p>}
          {error && <p className="mac-shake rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

          <div className="flex flex-wrap items-center justify-between gap-3">
            {!esYo ? (
              <button type="button" onClick={() => setConfirmar("eliminar")} className="mac-press rounded-xl px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                Eliminar usuario
              </button>
            ) : (
              <span />
            )}
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
        title="Eliminar usuario"
        message={`¿Seguro que querés eliminar a ${datos.Name}? No se puede deshacer.`}
        confirmText="Eliminar"
        onCancel={() => setConfirmar(null)}
        onConfirm={eliminar}
      />
    </>
  );
}

export default EditUserBtn;
