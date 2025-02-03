'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { GoEye } from 'react-icons/go';
import SelectMethodModal from './components/SelectMethodModal';
import MobilePasswordModal from './components/MobilePasswordModal';
import EmailPasswordModal from './components/EmailPasswordModal';
import NewPasswordModal from './components/NewPasswordModal';
import { RiEyeCloseLine } from 'react-icons/ri';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { login, setErrorAuth } from '@/lib/slices/authAction';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [inLogin, setInLogin] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState({ error: '' });
  const [loginUser, setLoginUser] = useState({
    Email: '',
    Password: '',
  });
  //Modals Manager State
  const [showModal, setShowModal] = useState(false);
  const [mobileMethod, setMobileMethod] = useState(false);
  const [emailMethod, setEmailMethod] = useState(false);
  const [method, setMethod] = useState(false);
  const [ableNewPassword, setAbleNewPassword] = useState(false);
  const errorAuth = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  let URL = `https://dumont-back.onrender.com/api/usuarios/login`;

  const dispatch = useDispatch();
  // llevar token a cookie
  function storeTokenInCookie(token) {
    // Configuración de la cookie con opciones de seguridad
    Cookies.set('auth_token', token, {
      expires: 7, // Expira en 7 días (puedes ajustarlo según tus necesidades)
      secure: true, // Solo se envía a través de HTTPS
      sameSite: 'Strict', // Protege contra ataques CSRF
      path: '/', // Disponible en todas las rutas del sitio
    });
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    setInLogin(true);

    dispatch(login(loginUser));

    if (isAuthenticated) {
      router.push('/admin');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  // Función para validar el input mail (asegúrate de definir esta función)
  const validateInputMail = (value) => {
    // Ejemplo de validación simple
    return /^[a-zA-Z0-9@.]+$/.test(value);
  };

  const validateInputPass = (value) => {
    // Ejemplo de validación simple
    return /^[a-zA-Z0-9!@#$%^&*()_+[\]{};':"\\|,.<>\/?`~-]+$/.test(value);
  };

  // Función handleChange modificada
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name);

    if (name === 'Email') {
      // Validar el input antes de actualizar el estado
      if (validateInputMail(value)) {
        // Actualizar el estado del objeto formState
        setLoginUser((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      } else {
        setErrorMessage({ error: 'Caracteres inválidos en el campo.' });

        // Limpiar el mensaje de error después de 3 segundos
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }
    }

    if (name === 'Password') {
      // Validar el input antes de actualizar el estado
      if (validateInputPass(value)) {
        // Actualizar el estado del objeto formState
        setLoginUser((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      } else {
        setErrorMessage({ error: 'Caracteres inválidos en el campo.' });

        // Limpiar el mensaje de error después de 3 segundos
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }
    }

    // Usar el valor actual directamente
    console.log('Current Input:', value);
  };

  useEffect(() => {
    console.log('showmodal:', showModal);
  }, [showModal]);

  useEffect(() => {
    if (errorAuth && inLogin === true) {
      setInLogin(false);
    }
  }, [inLogin, errorAuth]);
  console.log(errorAuth);

  return (
    <div className="w-full h-screen flex flex-row ">
      <div className="flex flex-col gap-4 justify-center items-center bg-[#F2F5F6] text-black h-[100%] w-2/4 p-12 border ">
        <div className="flex flex-col gap-4 ">
          <h2 className="text-5xl font-semibold">¡Bienvenido!</h2>
          <p className="text-xl">
            Para ingresar te pedimos que completes tus datos
          </p>
        </div>
        <form
          onSubmit={handleLogin}
          className="login-form flex items-center flex-col  w-full transition-all duration-300 "
        >
          <div className="form-group flex flex-col gap-1 w-[32rem] p-4 my-2">
            <label htmlFor="email" className="text-sm font-semibold">
              Email
            </label>
            <input
              type="email"
              name="Email"
              placeholder="Ingresa tu email"
              value={loginUser.Email}
              onChange={handleChange}
              required
              className="form-control bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
            />
          </div>

          <div className="form-group flex flex-col gap-2 w-[32rem] pt-1 p-4 my-2">
            <label htmlFor="password" className="text-sm font-semibold">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="Password"
              placeholder="Ingresa tu contraseña"
              value={loginUser.Password}
              onChange={handleChange}
              required
              className="form-control bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
            />
            {showPassword ? (
              <GoEye
                onClick={() => setShowPassword((prevState) => !prevState)}
                className="relative self-end bottom-11 right-4 w-5 h-5  cursor-pointer"
              />
            ) : (
              <RiEyeCloseLine
                onClick={() => setShowPassword((prevState) => !prevState)}
                className="relative self-end bottom-11 right-4 w-5 h-5  cursor-pointer"
              />
            )}
            <span
              onClick={() => setShowModal(true)}
              className="text-[#353344] text-lg relative bottom-5 cursor-pointer"
            >
              ¿Olvidaste tu contraseña?
            </span>
          </div>
          {errorMessage.error && (
            <div
              className="p-2 h-8 text-xs rounded flex justify-center  
          items-center bg-red-700 text-white font-medium -top-8 relative "
            >
              {errorMessage.error}{' '}
            </div>
          )}
          <button
            type="submit"
            className="w-[30rem] h-14 relative bottom-4 bg-[#427EF3] rounded-xl text-white text-lg tracking-wide font-semibold"
          >
            {' '}
            {inLogin ? (
              <p className="animate-pulse">Ingresando...</p>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>
        {errorAuth && <p className="text-red-600">{errorAuth}</p>}
      </div>

      <Image
        className="w-2/4 object-fill "
        src={'/LoginImage.jpeg'}
        width={867}
        height={1300}
        alt="Imagen Login"
        priority={true}
      />

      {showModal && (
        <>
          <SelectMethodModal
            setShowModal={setShowModal}
            setMobileMethod={setMobileMethod}
            setEmailMethod={setEmailMethod}
            mobileMethod={mobileMethod}
            emailMethod={emailMethod}
          />
        </>
      )}

      {mobileMethod && (
        <>
          <MobilePasswordModal
            setMobileMethod={setMobileMethod}
            setAbleNewPassword={setAbleNewPassword}
          />
        </>
      )}

      {emailMethod && (
        <>
          <EmailPasswordModal
            setEmailMethod={setEmailMethod}
            setAbleNewPassword={setAbleNewPassword}
          />
        </>
      )}

      {ableNewPassword && (
        <>
          <NewPasswordModal setAbleNewPassword={setAbleNewPassword} />
        </>
      )}
    </div>
  );
}

export default Login;
