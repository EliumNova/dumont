"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";
import logo from "@/public/DuMontLogo.jpeg";
import "../globals.css";
import "./Login.css";

function Login() {
  const [loginData, setLoginData] = useState({
    Email: "",
    Password: "",
  });
  const [status, setStatus] = useState("");
  const [statusClass, setStatusClass] = useState("status-message");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Segundo paso (verificación en 2 pasos): token temporal + código.
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [code, setCode] = useState("");

  const mostrarError = (mensaje) => {
    setStatus(mensaje);
    setStatusClass("status-show");
    setTimeout(() => setStatusClass("status-message"), 4000);
  };

  const guardarSesion = (data) => {
    localStorage.setItem("authToken", data.token);
    if (data.id) localStorage.setItem("userId", data.id);
    localStorage.setItem("isAuthenticated", "true");
    router.push("/admin");
  };

  const loginUser = async (e) => {
    e.preventDefault();

    // Paso 2: validar el código de la app de autenticación
    if (twoFactorToken) {
      if (!code.trim()) {
        mostrarError("Ingresá el código de 6 dígitos");
        return;
      }
      try {
        setLoading(true);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/login/2fa`,
          { twoFactorToken, code: code.trim() }
        );
        guardarSesion(response.data);
      } catch (error) {
        mostrarError(error.response?.data?.message || "No se pudo verificar el código");
        // Si el token temporal venció, vuelve al paso 1.
        if (error.response?.status === 401 && /expir/i.test(error.response?.data?.message || "")) {
          setTwoFactorToken("");
          setCode("");
        }
        setLoading(false);
      }
      return;
    }

    if (!loginData.Email || !loginData.Password) {
      mostrarError("Email y contraseña son obligatorios");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/login`,
        loginData
      );

      if (response.data.requires2FA) {
        setTwoFactorToken(response.data.twoFactorToken);
        setLoading(false);
        return;
      }
      guardarSesion(response.data);
    } catch (error) {
      const estado = error.response?.status;
      mostrarError(
        estado === 429 || estado === 403
          ? error.response.data?.message || "Acceso no permitido"
          : "Credenciales incorrectas"
      );
      setLoading(false);
    }
  };

  return (
    <div className="loginPage relative flex items-center justify-center h-screen overflow-hidden bg-[#060f3a]">
      {/* Fondo tipo layout */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-10"
        style={{ backgroundImage: "url('/DuMontLogo.jpeg')" }}></div>

      {/* Contenido del login */}
      <div className="loginWrapper relative z-10">
        <Image src={logo} alt="Logo" width={80} height={80} className="logo" />

        <form className="loginForm" onSubmit={loginUser}>
          {!twoFactorToken ? (
            <>
              <div className="inputGroup">
                <FaUserShield className="icon" />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  name="Email"
                  autoComplete="username"
                  value={loginData.Email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="inputGroup">
                <BsFillShieldLockFill className="icon" />
                <input
                  type="password"
                  placeholder="Contraseña"
                  name="Password"
                  autoComplete="current-password"
                  value={loginData.Password}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <p style={{ color: "#fff", textAlign: "center", fontSize: "0.9rem" }}>
                Verificación en 2 pasos: ingresá el código de tu app de
                autenticación (o un código de recuperación).
              </p>
              <div className="inputGroup">
                <BsFillShieldLockFill className="icon" />
                <input
                  type="text"
                  inputMode="text"
                  autoComplete="one-time-code"
                  autoFocus
                  placeholder="Código de 6 dígitos"
                  value={code}
                  maxLength={9}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <span className={statusClass}>{status}</span>

          <button type="submit" className="loginButton" disabled={loading}>
            <span>
              {loading
                ? "Verificando..."
                : twoFactorToken
                ? "Verificar"
                : "Iniciar sesión"}
            </span>
            {!loading && <AiOutlineSwapRight className="btnIcon" />}
          </button>
          {twoFactorToken && (
            <button
              type="button"
              className="loginButton"
              style={{ background: "transparent", marginTop: "0.5rem" }}
              onClick={() => {
                setTwoFactorToken("");
                setCode("");
              }}>
              <span>Volver</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
