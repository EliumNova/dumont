"use client";
import React, { useState } from "react";
import { GoEye } from "react-icons/go";
import { RiEyeCloseLine } from "react-icons/ri";
import { usePathname } from "next/navigation";
import ReactInputMask from "react-input-mask";

function UserRegistration() {
  const [showPassword, setShowPassword] = useState(false);
  const [show2doPassword, setShow2doPassword] = useState(false);
  const [password, setPassword] = useState();
  const [replicatePassword, setReplicatePassword] = useState();
  const [newUser, setNewUser] = useState({
    Name: "",
    DNI: "",
    Email: "",
    Phone: "",
    Password: "",
    Admin: "",
  });
  const [errorMessage, setErrorMessage] = useState({ error: "" });




 // Función para validar el input (asegúrate de definir esta función)
  const validateInput = (value) => {
    // Ejemplo de validación simple
    return /^[a-zA-Z0-9@.]+$/.test(value);
  };

  // Función handleChange modificada
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validar el input antes de actualizar el estado
    if (validateInput(value)) {
      // Actualizar el estado del objeto formState
      setNewUser(prevState => ({
        ...prevState,
        [name]: value
      }));
    } else {
      setErrorMessage({error: "Caracteres inválidos en el campo."});

      // Limpiar el mensaje de error después de 3 segundos
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
    
    // Usar el valor actual directamente
    console.log("Current Input:", value);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    if( password === replicatePassword) {
console.log("ok")
    }else{
      setErrorMessage({error: "Las contraseñas tienen que coincidir."});
    }

    console.log("submit");
    console.log("new", newUser);
  };

  return (
    <div className="flex flex-col gap-4 md:justify-center items-start h-[100%] w-3/4 p-12 m-auto flex-wrap ">
      <div className="left-0 md:left-[9.5rem] relative ">
        <h2 className="text-3xl md:text-5xl font-semibold ">Crear una cuenta</h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className=" flex items-center flex-col  w-full  "
      >
       <div className="w-4/5 h-auto flex flex-row gap-x-8 flex-wrap justify-start items-center 
     ">
         {/**nombre completo */}
         <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
          <label htmlFor="email" className="text-sm font-semibold">
            Nombre Completo
          </label>
          <input
            type="text"
            id="name"
            name="Name"
            onChange={handleChange}
            placeholder="Ingresa tu nombre completo"
            required
            className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
          />
        </div>
        {/**dni */}
        <div className="before-content flex flex-col gap-3 w-[32rem] p-4 mb-12 md:my-2 ">
          <label htmlFor="email" className="text-sm font-semibold">
            DNI
          </label>
          <input
            type="number"
            id="DNI"
            onChange={handleChange}
            name="DNI"
            placeholder="Ingresa tu documento"
            required
            className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
          />
           
        </div>
        {/**Email */}
        <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
          <label htmlFor="email" className="text-sm font-semibold">
            Email
          </label>
          <input
            type="text"
            id="email"
            onChange={handleChange}
            name="Email"
            placeholder="Ingresa tu email"
            required
            className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
          />
        </div>
        {/**Numero de teléfono */}
        <div className="flex flex-col gap-3 w-[32rem] p-4 my-2">
      <label htmlFor="mobile" className="text-sm font-semibold">
        Número de teléfono
      </label>
      <ReactInputMask
        mask="(999) 999-9999"
        placeholder="Ingresa tu número de teléfono"
        className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base "
        name="mobile"
      />
    </div>
        {/**Contraseña */}
        <div className=" flex flex-col gap-3 w-[32rem] pt-1 p-4 my-2">
            <label htmlFor="password" className="text-sm font-semibold">
              Password
            </label>
            <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="Password"
                    placeholder="Crear nueva contraseña"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
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
          </div>
        {/**Contraseña */}
        <div className=" flex flex-col gap-3 w-[32rem] pt-1 p-4 my-2 ">
            <label htmlFor="password" className="text-sm font-semibold">
             Repetir Password
            </label>
            <input
                    type={show2doPassword ? "text" : "password"}
                    id="password"
                    name="ConfirmPassword"
                    placeholder="Crear nueva contraseña"
                    onChange={(e) => setReplicatePassword(e.target.value)}
                    required
                    className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
                  />

                  {show2doPassword ? (
                    <GoEye
                      onClick={() =>
                        setShow2doPassword((prevState) => !prevState)
                      }
                      className="relative self-end bottom-11 right-4 w-5 h-5  cursor-pointer"
                    />
                  ) : (
                    <RiEyeCloseLine
                      onClick={() =>
                        setShow2doPassword((prevState) => !prevState)
                      }
                      className="relative self-end bottom-11 right-4 w-5 h-5  cursor-pointer"
                    />
                  )}
           
          </div>
        {/**Administrador */}
        <div className="flex flex-col gap-3 w-[32rem] pt-1 p-4 my-2 relative bottom-7 ">
          <label htmlFor="email" className="text-sm font-semibold">
            Administrador
          </label>
          <select
            id="admin"
            onChange={handleChange}
            name="admin"
            className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
            required
          >
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

       </div>
       {errorMessage.error && (
            <div
              className="p-2 h-8 text-xs rounded flex justify-center  
          items-center bg-red-700 text-white font-medium -top-8 relative ">
              {errorMessage.error}{" "}
            </div>
          )}
        <button
          type="submit"
          className="w-[30rem] h-14 relative top-11
          bg-[#427EF3] rounded-xl text-white text-lg tracking-wide font-semibold"
        >
         Registrarse
        </button>
      </form>
    </div>
  );
}

export default UserRegistration;
