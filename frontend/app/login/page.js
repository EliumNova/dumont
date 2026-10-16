"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiArrowLeft } from "react-icons/fi";
import logo from "@/public/DuMontLogo.jpeg";
import { leerTokenLocal } from "@/lib/slices/authAction";

const API = process.env.NEXT_PUBLIC_API_URL;

const inputCls =
  "w-full rounded-2xl border border-white/10 bg-white/10 py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/40 outline-none transition focus:border-blue-400 focus:bg-white/15 focus:ring-2 focus:ring-blue-400/40";

function Login() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({ Email: "", Password: "" });
  const [verPass, setVerPass] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [noVerificado, setNoVerificado] = useState(false);
  const [loading, setLoading] = useState(false);

  // Si ya hay una sesión vigente, directo al panel.
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const payload = token ? leerTokenLocal(token) : null;
    if (payload?.exp && payload.exp * 1000 > Date.now()) router.replace("/admin");
  }, [router]);

  const handleChange = (e) => {
    setLoginData((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const guardarSesion = (data) => {
    localStorage.setItem("authToken", data.token);
    if (data.id) localStorage.setItem("userId", data.id);
    localStorage.setItem("isAuthenticated", "true");
    router.push("/admin");
  };

  const loginUser = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setNoVerificado(false);

    // Paso 2: código de la app de autenticación
    if (twoFactorToken) {
      if (!code.trim()) return setError("Ingresá el código de tu app de autenticación.");
      try {
        setLoading(true);
        const { data } = await axios.post(`${API}/api/usuarios/login/2fa`, {
          twoFactorToken,
          code: code.trim(),
        });
        guardarSesion(data);
      } catch (err) {
        setError(err.response?.data?.message || "No se pudo verificar el código.");
        if (err.response?.status === 401 && /expir/i.test(err.response?.data?.message || "")) {
          setTwoFactorToken("");
          setCode("");
        }
        setLoading(false);
      }
      return;
    }

    if (!loginData.Email || !loginData.Password) {
      return setError("Ingresá tu correo y tu contraseña.");
    }
    try {
      setLoading(true);
      const { data } = await axios.post(`${API}/api/usuarios/login`, loginData);
      if (data.requires2FA) {
        setTwoFactorToken(data.twoFactorToken);
        setLoading(false);
        return;
      }
      guardarSesion(data);
    } catch (err) {
      const r = err.response;
      if (r?.data?.code === "NO_VERIFICADO") setNoVerificado(true);
      setError(
        r && [403, 429].includes(r.status) ? r.data?.message || "Acceso no permitido." : "Correo o contraseña incorrectos."
      );
      setLoading(false);
    }
  };

  const reenviar = async () => {
    try {
      await axios.post(`${API}/api/usuarios/reenviar-verificacion`, { Email: loginData.Email });
      setError("");
      setInfo("Si tu correo está pendiente de verificar, te enviamos un nuevo enlace.");
      setNoVerificado(false);
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo reenviar el correo.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060f3a] px-4">
      {/* Fondo: manchas de luz animadas + logo tenue */}
      <div className="pointer-events-none absolute inset-0">
        <div className="login-blob absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-blue-600/40 blur-3xl" />
        <div className="login-blob absolute -bottom-40 -right-24 h-[32rem] w-[32rem] rounded-full bg-cyan-500/30 blur-3xl [animation-delay:-6s]" />
        <div className="login-blob absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/30 blur-3xl [animation-delay:-12s]" />
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-[0.06]"
          style={{ backgroundImage: "url('/DuMontLogo.jpeg')" }}
        />
      </div>

      <div className="mac-modal relative z-10 w-full max-w-md rounded-[2rem] border border-white/15 bg-white/10 p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/20">
            <Image src={logo} alt="DuMont" width={72} height={72} priority />
          </div>
          <h1 className="text-2xl font-semibold text-white">
            {twoFactorToken ? "Verificación en 2 pasos" : "Bienvenido"}
          </h1>
          <p className="mt-1 text-sm text-white/60">
            {twoFactorToken
              ? "Ingresá el código de 6 dígitos de tu app de autenticación."
              : "Ingresá a tu panel de DuMont"}
          </p>
        </div>

        <form onSubmit={loginUser} className="flex flex-col gap-4" noValidate>
          {!twoFactorToken ? (
            <>
              <label className="relative block">
                <span className="sr-only">Correo electrónico</span>
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="email"
                  name="Email"
                  autoComplete="username"
                  placeholder="Correo electrónico"
                  value={loginData.Email}
                  onChange={handleChange}
                  className={inputCls}
                />
              </label>
              <label className="relative block">
                <span className="sr-only">Contraseña</span>
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type={verPass ? "text" : "password"}
                  name="Password"
                  autoComplete="current-password"
                  placeholder="Contraseña"
                  value={loginData.Password}
                  onChange={handleChange}
                  className={`${inputCls} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setVerPass((v) => !v)}
                  aria-label={verPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white">
                  {verPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </label>
            </>
          ) : (
            <label className="relative block">
              <span className="sr-only">Código</span>
              <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                autoFocus
                autoComplete="one-time-code"
                placeholder="123456"
                value={code}
                maxLength={9}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError("");
                }}
                className={`${inputCls} text-center text-lg tracking-[0.35em]`}
              />
            </label>
          )}

          {error && (
            <div role="alert" className="mac-shake rounded-2xl border border-red-400/30 bg-red-500/15 px-4 py-2.5 text-sm text-red-200">
              {error}
              {noVerificado && (
                <button type="button" onClick={reenviar} className="mt-1 block font-semibold text-white underline">
                  Reenviar correo de verificación
                </button>
              )}
            </div>
          )}
          {info && (
            <div className="rounded-2xl border border-green-400/30 bg-green-500/15 px-4 py-2.5 text-sm text-green-200">{info}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mac-press mt-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/40 hover:from-blue-400 hover:to-indigo-400 disabled:opacity-60">
            {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {loading ? "Verificando…" : twoFactorToken ? "Verificar" : "Iniciar sesión"}
          </button>

          {twoFactorToken && (
            <button
              type="button"
              onClick={() => {
                setTwoFactorToken("");
                setCode("");
                setError("");
              }}
              className="flex items-center justify-center gap-2 text-sm text-white/60 hover:text-white">
              <FiArrowLeft /> Volver
            </button>
          )}
        </form>
      </div>

      <style jsx global>{`
        @keyframes login-flotar {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.08); }
          66% { transform: translate(-30px, 40px) scale(0.95); }
        }
        .login-blob { animation: login-flotar 22s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .login-blob { animation: none; } }
      `}</style>
    </div>
  );
}

export default Login;
