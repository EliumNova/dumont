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
  
 

  const handleSubmit = () => {
    console.log("submit");
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
            type="text"
            id="DNI"
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
              Password
            </label>
            <input
                    type={show2doPassword ? "text" : "password"}
                    id="password"
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
            className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
            required
          >
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

       </div>
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
