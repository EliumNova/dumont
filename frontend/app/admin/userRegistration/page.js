'use client';
import React, { useState } from 'react';
import ReactInputMask from 'react-input-mask';
import InputField from '../components/InputField';
import PasswordField from '../components/PasswordField';
import ModalWindow from '../components/ModalWindow';
import { Griffy } from 'next/font/google';

function UserRegistration() {
  const [showPassword, setShowPassword] = useState({
    first: false,
    second: false,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [registerUser, setRegisterUser] = useState({
    name: '',
    email: '',
    password: '',
    validatePassword: '',
    admin: false,
    dni: '',
    phone: '',
  });
  const [modal, setModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, password, validatePassword, dni, phone } =
      registerUser;

    // Validar que todos los campos están llenos
    if (!name || !email || !password || !validatePassword || !dni || !phone) {
      setErrorMessage('Todos los campos son obligatorios.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== validatePassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    // Validar la contraseña
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{10,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        'La contraseña debe tener al menos 10 caracteres, una letra, un número y un símbolo.'
      );
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    // Validar el formato del teléfono
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMessage('Número de teléfono inválido.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    console.log(JSON.stringify(registerUser, null, 2));

    // Resetear el formulario
    setRegisterUser({
      name: '',
      email: '',
      password: '',
      validatePassword: '',
      admin: false,
      dni: '',
      phone: '',
    });

    setModal(true);
    setTimeout(() => {
      setModal(false);
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const processedValue = name === 'admin' ? value === 'true' : value;

    const validations = {
      dni: /^[0-9]*$/,
      phone: /^[0-9\s()]*$/,
      name: /^[a-zA-Z\s]*$/,
      email: /^[a-zA-Z@.\s]*$/,
      password: /^[A-Za-z\d\W_]*$/,
      validatePassword: /^[A-Za-z\d\W_]*$/,
    };

    if (name === 'phone') {
      const maskedValue = e.target.inputElement
        ? e.target.inputElement.value
        : value;
      registrar(name, maskedValue);
    } else if (name in validations) {
      if (value === '' || validateInput(processedValue, validations[name])) {
        registrar(name, processedValue);
      } else {
        errorMessageBox();
      }
    } else {
      registrar(name, processedValue);
    }
  };

  const errorMessageBox = () => {
    setErrorMessage('Caracteres inválidos en el campo.');
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const validateInput = (value, regex) => regex.test(value);

  const registrar = (name, processedValue) => {
    return setRegisterUser((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  return (
    <div className="container mx-auto flex flex-col justify-center items-center justify-center my-5">
      {modal ? (
        <ModalWindow text={'¡Usuario creado con èxito!'} />
      ) : (
        <div></div>
      )}

      <h2 className="text-white text-3xl md:text-5xl font-semibold my-2 place-self-center xl:place-self-start xl:pl-[11%] 2xl:pl-[14%]">
        Crear una cuenta
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full lg:w-9/12 xl:w-10/12  my-2 px-4 text-white"
      >
        <div className="container mx-auto grid grid-cols-1 w-full  items-center xl:grid-cols-2 justify-items-center xl:items-center">
          <InputField
            label="Nombre Completo"
            id="name"
            value={registerUser.name}
            onChange={handleChange}
            placeholder="Ingresa tu nombre completo"
            required
            className="col-span-1 xl:col-start-1 row-start-1 lg:w-[32rem] gap-3 font-semibold px-4 "
            inputClassName="font-light"
          />
          <InputField
            label="DNI"
            id="dni"
            value={registerUser.dni}
            onChange={handleChange}
            placeholder="Ingresa tu documento"
            required
            className="col-span-1 xl:col-start-2 xl:row-start-1 lg:w-[32rem] gap-3 font-semibold px-4"
            inputClassName="font-light"
          />
          <InputField
            label="Email"
            id="email"
            value={registerUser.email}
            onChange={handleChange}
            placeholder="Ingresa tu email"
            type="email"
            required
            className="col-span-1 xl:col-start-1 xl:row-start-2 lg:w-[32rem] gap-3 font-semibold px-4"
            inputClassName="font-light"
          />
          <div className="col-span-1 xl:col-start-2 xl:row-start-2 flex flex-col gap-3 w-full lg:w-[32rem] px-4">
            <label htmlFor="phone" className="text-sm font-semibold">
              Número de teléfono
            </label>
            <ReactInputMask
              mask="(999) 999-9999"
              name="phone"
              value={registerUser.phone}
              onChange={handleChange}
              placeholder="Ingresa tu número de teléfono"
              className="bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
            />
          </div>

          <PasswordField
            label="Password"
            name="password"
            value={registerUser.password}
            showPassword={showPassword.first}
            togglePassword={() =>
              setShowPassword((prev) => ({ ...prev, first: !prev.first }))
            }
            onChange={handleChange}
            required
            className="col-span-1 xl:col-start-1 xl:row-start-3"
          />
          <PasswordField
            label="Repetir Password"
            name="validatePassword"
            value={registerUser.validatePassword}
            showPassword={showPassword.second}
            togglePassword={() =>
              setShowPassword((prev) => ({ ...prev, second: !prev.second }))
            }
            onChange={handleChange}
            required
            className="col-span-1 xl:col-start-2 xl:row-start-3"
          />
          <div className="col-span-1 xl:col-start-1 xl:row-start-4 flex flex-col gap-3 w-full lg:w-[32rem] px-4">
            <label htmlFor="admin" className="text-sm font-semibold">
              Administrador
            </label>
            <select
              id="admin"
              name="admin"
              value={registerUser.admin.toString()}
              onChange={handleChange}
              className="bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
              required
            >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        {errorMessage && (
          <div className="p-2 h-8 text-xs rounded flex justify-center items-center bg-red-700 text-white font-medium relative">
            {errorMessage}
          </div>
        )}
        <button
          type="submit"
          className="w-11/12 lg:w-[30rem] p-4 relative top-11 bg-[#427EF3] rounded-xl text-white text-lg tracking-wide font-semibold"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default UserRegistration;
