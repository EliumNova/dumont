"use client";
import React, { Suspense, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

// Página a la que lleva el enlace del mail de verificación.
function Verificar() {
  const token = useSearchParams().get("token");
  const [estado, setEstado] = useState("cargando"); // cargando | ok | error
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!token) {
      setEstado("error");
      setMensaje("El enlace no es válido.");
      return;
    }
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/confirmVerify`, { token })
      .then((res) => {
        setEstado("ok");
        setMensaje(res.data?.message || "Correo verificado.");
      })
      .catch((err) => {
        setEstado("error");
        setMensaje(err.response?.data?.message || "No se pudo verificar el correo.");
      });
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060f3a] px-4">
      <div className="mac-modal w-full max-w-md rounded-[2rem] border border-white/15 bg-white/10 p-10 text-center text-white shadow-2xl backdrop-blur-2xl">
        {estado === "cargando" && (
          <>
            <span className="mx-auto mb-4 block h-10 w-10 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
            <p>Verificando tu correo…</p>
          </>
        )}
        {estado === "ok" && (
          <>
            <FiCheckCircle className="mx-auto mb-4 h-14 w-14 text-green-400" />
            <h1 className="mb-2 text-2xl font-semibold">¡Cuenta verificada!</h1>
            <p className="mb-6 text-white/70">{mensaje}</p>
            <Link href="/login" className="mac-press inline-block rounded-2xl bg-blue-500 px-8 py-3 text-sm font-semibold hover:bg-blue-400">
              Iniciar sesión
            </Link>
          </>
        )}
        {estado === "error" && (
          <>
            <FiAlertCircle className="mx-auto mb-4 h-14 w-14 text-red-400" />
            <h1 className="mb-2 text-2xl font-semibold">No pudimos verificarte</h1>
            <p className="mb-6 text-white/70">{mensaje}</p>
            <Link href="/login" className="mac-press inline-block rounded-2xl bg-white/15 px-8 py-3 text-sm font-semibold hover:bg-white/25">
              Ir al login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerificarPage() {
  return (
    <Suspense fallback={null}>
      <Verificar />
    </Suspense>
  );
}
