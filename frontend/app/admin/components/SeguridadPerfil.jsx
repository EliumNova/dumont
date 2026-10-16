"use client";

import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { FiShield, FiCopy } from "react-icons/fi";
import { USERS } from "@/lib/slices/constants";
import { fetchUserData } from "@/lib/slices/authAction";
import QrCode from "./QrCode";

const campoCls =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

// Sección "Verificación en 2 pasos" del perfil. Funciona con cualquier app de
// autenticación (Google Authenticator, Microsoft Authenticator, Authy, 1Password…).
export default function SeguridadPerfil() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const activo = !!user?.TwoFactorEnabled;

  const [fase, setFase] = useState("inicio"); // inicio | configurando | codigos | desactivando
  const [setup, setSetup] = useState(null); // { secret, otpauthUrl }
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [recovery, setRecovery] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [copiado, setCopiado] = useState("");

  const refrescar = () => user?.id && dispatch(fetchUserData(user.id));

  const llamar = async (fn) => {
    setError("");
    setCargando(true);
    try {
      await fn();
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error. Intentá de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const empezar = () =>
    llamar(async () => {
      const { data } = await axios.post(`${USERS}/2fa/setup`);
      setSetup(data);
      setCodigo("");
      setFase("configurando");
    });

  const confirmar = (e) => {
    e.preventDefault();
    llamar(async () => {
      const { data } = await axios.post(`${USERS}/2fa/enable`, { code: codigo });
      setRecovery(data.recoveryCodes || []);
      setSetup(null);
      setCodigo("");
      setFase("codigos");
      refrescar();
    });
  };

  const desactivar = (e) => {
    e.preventDefault();
    llamar(async () => {
      await axios.post(`${USERS}/2fa/disable`, { Password: password, code: codigo });
      setPassword("");
      setCodigo("");
      setFase("inicio");
      refrescar();
    });
  };

  const copiar = async (texto, etiqueta) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(etiqueta);
      setTimeout(() => setCopiado(""), 1800);
    } catch {
      /* sin permiso de portapapeles */
    }
  };

  return (
    <section className="mt-6 border-t border-black/10 pt-5">
      <div className="mb-3 flex items-center gap-2">
        <FiShield className={activo ? "text-green-600" : "text-gray-500"} />
        <h3 className="text-base font-semibold">Verificación en 2 pasos</h3>
        <span
          className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium ${
            activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
          }`}>
          {activo ? "Activada" : "Desactivada"}
        </span>
      </div>

      {fase === "inicio" && (
        <div className="mac-fade-up flex flex-col gap-3">
          <p className="text-sm text-gray-600">
            {activo
              ? "Al iniciar sesión te pedimos, además de la contraseña, un código de tu app de autenticación."
              : "Sumá una capa extra: además de la contraseña, se pedirá un código de tu celular al iniciar sesión."}
          </p>
          {activo ? (
            <button
              type="button"
              onClick={() => {
                setError("");
                setFase("desactivando");
              }}
              className="mac-press self-start rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
              Desactivar
            </button>
          ) : (
            <button
              type="button"
              onClick={empezar}
              disabled={cargando}
              className="mac-press self-start rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60">
              {cargando ? "Preparando…" : "Activar"}
            </button>
          )}
        </div>
      )}

      {fase === "configurando" && setup && (
        <form onSubmit={confirmar} className="mac-fade-up flex flex-col gap-3">
          <p className="text-sm text-gray-700">
            Abrí tu app de autenticación (Google Authenticator, Authy, Microsoft
            Authenticator…), elegí “Agregar cuenta” y <strong>escaneá este código QR</strong>:
          </p>
          <div className="flex justify-center">
            <div className="rounded-2xl bg-white p-2 shadow-md">
              <QrCode value={setup.otpauthUrl} size={200} />
            </div>
          </div>
          <p className="text-center text-xs text-gray-500">
            ¿No podés escanear? Ingresá esta clave a mano (tipo: basada en tiempo):
          </p>
          <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2">
            <code className="flex-1 break-all text-sm tracking-wider">{setup.secret}</code>
            <button
              type="button"
              onClick={() => copiar(setup.secret, "clave")}
              className="mac-press rounded-lg p-2 hover:bg-gray-200"
              aria-label="Copiar clave">
              <FiCopy />
            </button>
          </div>
          {copiado === "clave" && <span className="text-xs text-green-600">Copiada</span>}
          <a href={setup.otpauthUrl} className="text-xs text-blue-600 underline">
            Abrir directamente en la app (desde el celular)
          </a>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Código de 6 dígitos que muestra la app
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              className={campoCls}
            />
          </label>
          {error && <p className="mac-shake rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={cargando || codigo.length !== 6} className="mac-press rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60">
              {cargando ? "Verificando…" : "Confirmar y activar"}
            </button>
            <button type="button" onClick={() => { setFase("inicio"); setSetup(null); setError(""); }} className="mac-press rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {fase === "codigos" && (
        <div className="mac-fade-up flex flex-col gap-3">
          <p className="rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">
            ¡Verificación en 2 pasos activada!
          </p>
          <p className="text-sm text-gray-700">
            Guardá estos códigos de recuperación en un lugar seguro. Cada uno sirve
            <strong> una sola vez</strong> si perdés el celular, y <strong>no se vuelven a mostrar</strong>.
          </p>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-3 font-mono text-sm">
            {recovery.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => copiar(recovery.join("\n"), "codigos")} className="mac-press flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100">
              <FiCopy /> {copiado === "codigos" ? "Copiados" : "Copiar"}
            </button>
            <button type="button" onClick={() => { setRecovery([]); setFase("inicio"); }} className="mac-press rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
              Ya los guardé
            </button>
          </div>
        </div>
      )}

      {fase === "desactivando" && (
        <form onSubmit={desactivar} className="mac-fade-up flex flex-col gap-3">
          <p className="text-sm text-gray-600">
            Para desactivarla confirmá tu contraseña y un código actual de la app (o uno de recuperación).
          </p>
          <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className={campoCls} />
          <input value={codigo} onChange={(e) => setCodigo(e.target.value)} autoComplete="one-time-code" placeholder="Código" maxLength={9} className={campoCls} />
          {error && <p className="mac-shake rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={cargando || !password || !codigo} className="mac-press rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60">
              {cargando ? "Desactivando…" : "Desactivar"}
            </button>
            <button type="button" onClick={() => { setFase("inicio"); setError(""); }} className="mac-press rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {error && fase === "inicio" && (
        <p className="mac-shake mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}
    </section>
  );
}
