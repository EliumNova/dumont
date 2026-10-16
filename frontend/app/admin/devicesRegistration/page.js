"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { DISPOSITIVOS, CLIENTS, DISTRIBUIDORES } from "@/lib/slices/constants";
import FormCard, { Seccion, BotonesForm, Aviso } from "../components/FormCard";
import Field from "../components/Field";
import SelectConOtra from "../components/SelectConOtra";
import ConfirmDialog from "../components/ConfirmDialog";
import { validarFormulario, validarRequerido } from "@/lib/formato";

const INICIAL = {
  CodigoDistribuidor: "", // solo para filtrar clientes, no se envía
  CodigoCliente: "",
  Marca: "",
  Modelo: "",
  NumSerie: "",
};

const REGLAS = {
  CodigoDistribuidor: (v) => validarRequerido(v, "El distribuidor"),
  CodigoCliente: (v) => validarRequerido(v, "El cliente"),
  Marca: (v) => validarRequerido(v, "La marca"),
  Modelo: (v) => validarRequerido(v, "El modelo"),
  NumSerie: (v) => {
    const t = String(v ?? "").trim();
    if (!t) return "El número de serie es obligatorio.";
    if (t.length < 4) return "El número de serie es demasiado corto.";
    if (!/^[A-Za-z0-9._\-/]+$/.test(t)) return "Usá solo letras, números y . _ - /";
    return "";
  },
};

function DispositivoRegistration() {
  const router = useRouter();
  const [form, setForm] = useState(INICIAL);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState(false);

  const [distribuidores, setDistribuidores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [opciones, setOpciones] = useState({ marcas: [], modelos: {} });

  const cargarOpciones = () =>
    axios
      .get(`${DISPOSITIVOS}/opciones`)
      .then((r) => setOpciones(r.data))
      .catch((e) => console.error("Opciones de dispositivos:", e));

  useEffect(() => {
    axios
      .get(DISTRIBUIDORES, { params: { page: 0, pageSize: 10000 } })
      .then((r) => setDistribuidores(r.data?.rows || []))
      .catch((e) => console.error("Distribuidores:", e));
    axios
      .get(CLIENTS, { params: { page: 0, pageSize: 10000 } })
      .then((r) => setClientes(r.data?.rows || []))
      .catch((e) => console.error("Clientes:", e));
    cargarOpciones();
  }, []);

  const clientesDelDistribuidor = useMemo(
    () =>
      form.CodigoDistribuidor
        ? clientes.filter((c) => String(c.CodigoDistribuidor) === String(form.CodigoDistribuidor))
        : [],
    [clientes, form.CodigoDistribuidor]
  );
  const clienteElegido = clientes.find((c) => String(c.CodigoCliente) === String(form.CodigoCliente));
  const modelosSugeridos = opciones.modelos[form.Marca] || [];

  const set = (campo, valor) => {
    setForm((p) => ({ ...p, [campo]: valor }));
    setErrores((e) => ({ ...e, [campo]: "" }));
    setErrorGeneral("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validarFormulario(form, REGLAS);
    setErrores(errs);
    if (Object.keys(errs).length) return;

    setGuardando(true);
    try {
      // El Código Dumont lo arma el backend a partir del cliente elegido.
      await axios.post(`${DISPOSITIVOS}/create`, {
        CodigoCliente: form.CodigoCliente,
        Marca: form.Marca.trim(),
        Modelo: form.Modelo.trim(),
        NumSerie: form.NumSerie.trim(),
      });
      setExito(true);
      setForm(INICIAL);
      cargarOpciones(); // si la marca era nueva, ya aparece en la lista
    } catch (err) {
      const r = err.response;
      setErrorGeneral(
        r?.status === 409
          ? "Ya existe un dispositivo con ese número de serie."
          : r?.data?.message || "No se pudo registrar el dispositivo."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      <FormCard
        title="Registrar dispositivo"
        subtitle="Elegí el distribuidor y su cliente: el Código DuMont se asigna solo."
        onBack={() => router.push("/admin")}
        maxWidth="max-w-3xl">
        <form onSubmit={handleSubmit} noValidate>
          <Aviso>{errorGeneral}</Aviso>

          <Seccion titulo="Ubicación del equipo">
            <Field
              label="Distribuidor"
              value={form.CodigoDistribuidor}
              error={errores.CodigoDistribuidor}
              onChange={(e) => {
                set("CodigoDistribuidor", e.target.value);
                set("CodigoCliente", ""); // depende del distribuidor
              }}
              options={[
                { value: "", label: "Seleccioná un distribuidor…" },
                ...distribuidores.map((d) => ({
                  value: String(d.CodigoDistribuidor),
                  label: `${d.CodigoDistribuidor} — ${d.NombreComercial}`,
                })),
              ]}
            />
            <Field
              label="Cliente"
              value={form.CodigoCliente}
              error={errores.CodigoCliente}
              disabled={!form.CodigoDistribuidor}
              onChange={(e) => set("CodigoCliente", e.target.value)}
              hint={
                form.CodigoDistribuidor && clientesDelDistribuidor.length === 0
                  ? "Este distribuidor todavía no tiene clientes."
                  : undefined
              }
              options={[
                {
                  value: "",
                  label: form.CodigoDistribuidor ? "Seleccioná un cliente…" : "Primero elegí un distribuidor",
                },
                ...clientesDelDistribuidor.map((c) => ({
                  value: c.CodigoCliente,
                  label: `${c.CodigoCliente} — ${c.NombreCompleto}`,
                })),
              ]}
            />
            {clienteElegido && (
              <div className="mac-fade-up rounded-2xl bg-blue-50 px-4 py-3 sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-blue-600">Código DuMont asignado</p>
                <p className="mt-0.5 font-mono text-lg font-semibold tracking-wider text-blue-900">
                  {clienteElegido.CodigoDumont || "—"}
                </p>
              </div>
            )}
          </Seccion>

          <Seccion titulo="Datos del dispositivo">
            <SelectConOtra
              label="Marca"
              value={form.Marca}
              onChange={(v) => {
                set("Marca", v);
                set("Modelo", "");
              }}
              options={opciones.marcas}
              error={errores.Marca}
              otraPlaceholder="Escribí la marca (se guarda para la próxima)"
            />
            <div>
              <Field
                label="Modelo"
                value={form.Modelo}
                error={errores.Modelo}
                onChange={(e) => set("Modelo", e.target.value)}
                list="modelos-sugeridos"
                maxLength={45}
                placeholder={form.Marca ? "Elegí uno existente o escribí uno nuevo" : "Primero elegí la marca"}
                disabled={!form.Marca}
              />
              <datalist id="modelos-sugeridos">
                {modelosSugeridos.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </div>
            <Field
              label="Número de serie"
              value={form.NumSerie}
              error={errores.NumSerie}
              onChange={(e) => set("NumSerie", e.target.value)}
              maxLength={45}
              placeholder="Ej. R9XT30ABC12"
              className="sm:col-span-2"
            />
          </Seccion>

          <BotonesForm onCancel={() => router.push("/admin")} submitText="Registrar dispositivo" loading={guardando} />
        </form>
      </FormCard>

      <ConfirmDialog
        isOpen={exito}
        danger={false}
        icon="✓"
        hideCancel
        title="¡Dispositivo registrado!"
        message="Ya podés registrar otro o volver al menú."
        confirmText="Entendido"
        onConfirm={() => setExito(false)}
        onCancel={() => setExito(false)}
      />
    </>
  );
}

export default DispositivoRegistration;
