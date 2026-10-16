"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { USERS } from "@/lib/slices/constants";
import FormCard, { Seccion, BotonesForm, Aviso } from "../components/FormCard";
import Field from "../components/Field";
import CampoPassword from "../components/CampoPassword";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  validarFormulario,
  validarNombre,
  validarEmail,
  validarDNI,
  validarTelefono,
  validarPassword,
} from "@/lib/formato";

const INICIAL = {
  Name: "",
  DNI: "",
  Email: "",
  Telefono: "",
  Password: "",
  ValidatePassword: "",
  isAdmin: "false",
};

const REGLAS = {
  Name: (v) => validarNombre(v, "El nombre"),
  DNI: validarDNI,
  Email: validarEmail,
  Telefono: validarTelefono,
  Password: validarPassword,
  ValidatePassword: (v, todos) => (v === todos.Password ? "" : "Las contraseñas no coinciden."),
};

function UserRegistration() {
  const router = useRouter();
  const [form, setForm] = useState(INICIAL);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [resultado, setResultado] = useState(null); // respuesta del alta

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrores((er) => ({ ...er, [name]: "" }));
    setErrorGeneral("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validarFormulario(form, REGLAS);
    setErrores(errs);
    if (Object.keys(errs).length) return;

    setGuardando(true);
    try {
      // DNI y teléfono viajan como dígitos puros (el formato es solo visual).
      const { data } = await axios.post(`${USERS}/create`, {
        Name: form.Name.trim(),
        Email: form.Email.trim().toLowerCase(),
        DNI: Number(form.DNI),
        Telefono: form.Telefono,
        Password: form.Password,
        isAdmin: form.isAdmin === "true",
      });
      setResultado(data);
      setForm(INICIAL);
    } catch (err) {
      const r = err.response;
      setErrorGeneral(
        r?.status === 409
          ? "Ya existe un usuario con ese correo o DNI."
          : r?.status === 403
          ? "Solo un administrador puede crear usuarios."
          : r?.data?.message || "No se pudo crear el usuario."
      );
    } finally {
      setGuardando(false);
    }
  };

  const mensajeExito = !resultado
    ? ""
    : resultado.requiereVerificacion
    ? resultado.verificacionEnviada
      ? "Le enviamos un correo para que confirme su cuenta. No podrá ingresar hasta hacerlo."
      : "El usuario se creó, pero no pudimos enviar el correo de verificación. Podrá pedirlo de nuevo desde el login."
    : "El usuario ya puede iniciar sesión.";

  return (
    <>
      <FormCard
        title="Crear una cuenta"
        subtitle="La persona recibirá un correo para verificar su cuenta antes de poder ingresar."
        onBack={() => router.push("/admin")}
        maxWidth="max-w-3xl">
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <Aviso>{errorGeneral}</Aviso>

          <Seccion titulo="Datos personales">
            <Field label="Nombre completo" name="Name" value={form.Name} error={errores.Name} onChange={cambiar} maxLength={45} placeholder="Ej. Ana García" />
            <Field label="DNI" name="DNI" formato="dni" value={form.DNI} error={errores.DNI} onChange={cambiar} placeholder="12.345.678" />
            <Field label="Correo electrónico" name="Email" type="email" value={form.Email} error={errores.Email} onChange={cambiar} maxLength={45} placeholder="nombre@dominio.com" />
            <Field label="Teléfono" name="Telefono" formato="telefono" value={form.Telefono} error={errores.Telefono} onChange={cambiar} placeholder="11 5555-5555" />
          </Seccion>

          <Seccion titulo="Acceso">
            <CampoPassword label="Contraseña" name="Password" value={form.Password} error={errores.Password} onChange={cambiar} medidor autoComplete="new-password" />
            <CampoPassword label="Repetir contraseña" name="ValidatePassword" value={form.ValidatePassword} error={errores.ValidatePassword} onChange={cambiar} autoComplete="new-password" />
            <Field
              label="Rol"
              name="isAdmin"
              value={form.isAdmin}
              onChange={cambiar}
              hint="Los administradores pueden gestionar otros usuarios."
              options={[
                { value: "false", label: "Usuario" },
                { value: "true", label: "Administrador" },
              ]}
            />
          </Seccion>

          <BotonesForm onCancel={() => router.push("/admin")} submitText="Crear cuenta" loading={guardando} />
        </form>
      </FormCard>

      <ConfirmDialog
        isOpen={!!resultado}
        danger={false}
        icon="✓"
        hideCancel
        title="¡Usuario creado!"
        message={mensajeExito}
        confirmText="Entendido"
        onConfirm={() => setResultado(null)}
        onCancel={() => setResultado(null)}
      />
    </>
  );
}

export default UserRegistration;
