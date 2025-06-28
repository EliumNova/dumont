'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaUserShield } from 'react-icons/fa';
import { BsFillShieldLockFill } from 'react-icons/bs';
import { AiOutlineSwapRight } from 'react-icons/ai';
import logo from '@/public/DuMontLogo.jpeg';
import './Login.css';

function Login() {
  const [loginData, setLoginData] = useState({
    Email: '',
    Password: '',
  });
  const [status, setStatus] = useState('');
  const [statusClass, setStatusClass] = useState('status-message');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loginUser = async (e) => {
    e.preventDefault();

    if (!loginData.Email || !loginData.Password) {
      setStatus('Email y contraseña son obligatorios');
      setStatusClass('status-show');
      setTimeout(() => setStatusClass('status-message'), 3000);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/login`,
        loginData
      );

      const { token } = response.data;
      localStorage.setItem('authToken', token);
      router.push('/admin');
    } catch (error) {
      setStatus('Credenciales incorrectas');
      setStatusClass('status-show');
      setTimeout(() => setStatusClass('status-message'), 3000);
    }
  };

  return (
    <div className="loginPage relative flex items-center justify-center h-screen overflow-hidden bg-[#060f3a]">
      {/* Fondo tipo layout */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-10"
        style={{ backgroundImage: "url('/DuMontLogo.jpeg')" }}
      ></div>

      {/* Contenido del login */}
      <div className="loginWrapper relative z-10">
        <Image src={logo} alt="Logo" width={80} height={80} className="logo" />

        <form className="loginForm" onSubmit={loginUser}>
          <div className="inputGroup">
            <FaUserShield className="icon" />
            <input
              type="email"
              placeholder="Correo electrónico"
              name="Email"
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
              value={loginData.Password}
              onChange={handleChange}
              required
            />
          </div>

          <span className={statusClass}>{status}</span>

          <button type="submit" className="loginButton">
            <span>Iniciar sesión</span>
            <AiOutlineSwapRight className="btnIcon" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
