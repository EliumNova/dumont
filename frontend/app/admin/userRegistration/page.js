"use client";
import React, { useState } from "react";
import ReactInputMask from "react-input-mask";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";

function UserRegistration() {
  const [showPassword, setShowPassword] = useState({
    first: false,
    second: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [registerUser, setRegisterUser] = useState({
    name: "",
    email: "",
    password: "",
    validatePassword: "",
    admin: false,
    dni: "",
    phone: "",
  });

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, password, validatePassword, dni, phone } =
      registerUser;

    // Validar que todos los campos están llenos
    if (!name || !email || !password || !validatePassword || !dni || !phone) {
      setErrorMessage("Todos los campos son obligatorios.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== validatePassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    // Resetear el formulario
    setRegisterUser({
      name: "",
      email: "",
      password: "",
      validatePassword: "",
      admin: false,
      dni: "",
      phone: "",
    });

    // Si todo es correcto, procesar el registro
    console.log("Formulario enviado");
    console.log(JSON.stringify(registerUser, null, 2)); // Muestra el formulario con sangría
  };

  const errorMessageBox = () => {
    setErrorMessage("Caracteres inválidos en el campo.");
    setTimeout(() => setErrorMessage(""), 3000);
  };

  const validateInput = (value, regex) => regex.test(value);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const processedValue = name === "admin" ? value === "true" : value;

    const validations = {
      dni: /^[0-9]*$/,
      phone: /^[0-9\s]*$/,
      name: /^[a-zA-Z\s]*$/,
      email: /^[a-zA-Z@.\s]*$/,
      password: /^[a-zA-Z0-9@.\s\W]*$/,
      validatePassword: /^[a-zA-Z0-9@.\s\W]*$/,
    };

    if (name === "phone") {
      const maskedValue = e.target.inputElement
        ? e.target.inputElement.value
        : value;
      setRegisterUser((prev) => ({
        ...prev,
        [name]: maskedValue,
      }));
    } else if (name in validations) {
      if (value === "" || validateInput(processedValue, validations[name])) {
        setRegisterUser((prev) => ({
          ...prev,
          [name]: processedValue,
        }));
      } else {
        errorMessageBox();
      }
    } else {
      setRegisterUser((prev) => ({
        ...prev,
        [name]: processedValue,
      }));
    }
  };

  return (
    <div className="flex flex-col gap-4 md:justify-center items-start h-[100%] w-3/4 p-12 m-auto flex-wrap">
      <div className="left-0 md:left-[9.5rem] relative ">
        <h2 className="text-3xl md:text-5xl font-semibold">Crear una cuenta</h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center flex-col w-full"
      >
        <div className="w-4/5 h-auto flex flex-row gap-x-8 flex-wrap justify-start items-center">
          <InputField
            label="Nombre Completo"
            id="name"
            value={registerUser.name}
            onChange={handleChange}
            placeholder="Ingresa tu nombre completo"
            required
          />
          <InputField
            label="DNI"
            id="dni"
            value={registerUser.dni}
            onChange={handleChange}
            placeholder="Ingresa tu documento"
            required
          />
          <InputField
            label="Email"
            id="email"
            value={registerUser.email}
            onChange={handleChange}
            placeholder="Ingresa tu email"
            type="email"
            required
          />
          <div className="flex flex-col gap-3 w-[32rem] p-4 my-2">
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
          />
          <div className="flex flex-col gap-3 w-[32rem] pt-1 p-4 my-2 relative bottom-7">
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
          className="w-[30rem] h-14 relative top-11 bg-[#427EF3] rounded-xl text-white text-lg tracking-wide font-semibold"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default UserRegistration;
