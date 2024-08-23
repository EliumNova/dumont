import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

function EmailPasswordModal({ setEmailMethod, setAbleNewPassword }) {
  const [stepTwo, setStepTwo] = useState(false);
  const [codeCorrectly, setCodeCorrectly] = useState(true);

  const handleCode = () => {
    if (codeCorrectly) {
      setEmailMethod(false);
      setAbleNewPassword(true);
    } else console.log("codigo incorrecto");
  };

  return (
    <div className="fixed inset-0  bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div
        className="bg-white pb-32
     w-[50rem] h-[35rem] text-black p-10 pt-6 rounded-[20px] shadow-lg max-w-xl flex justify-start  flex-col "
      >
        <button
          className=" self-end relative top-4 cursor-pointer"
          onClick={() => setEmailMethod(false)}
        >
          <IoClose className="w-8 h-8  " />
        </button>
        {stepTwo ? (
          <>
            <h2 className="text-4xl font-bold mb-4 ">Escribe el código</h2>
            <p className="mb-4 p-4 pt-0 pl-0 pr-6">
              Ingresa el código que te pasamos por email, fíjate en tu casilla
              Principal o de Spam.
            </p>
            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="flex flex-col gap-2  w-full">
                <label htmlFor="email" className="font-semibold text-sm">
                  Codigo de recuperacion
                </label>
                <input
                  type="number"
                  placeholder="Ingresa código de recuperacion"
                  className=" bg-[#E2E5E5] h-14 rounded-lg p-4  w-full text-[#353344] text-sm"
                />
              </div>
              <button onClick={handleCode} className="bg-[#427EF3] w-[31rem] rounded-lg h-12 mt-12 text-white">
                Siguiente
              </button>
            </div>
          </>
        ) : (
          <>
            {" "}
            <h2 className="text-4xl font-bold mb-4 ">Recuperar contraseña</h2>
            <p className="mb-4 p-4 pt-0 pl-0 pr-6">
              Para recibir instrucciones sobre cómo restablecer tu contraseña te
              pedimos que escribas tu correo electrónico ligado a tu cuenta.
            </p>
            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="flex flex-col gap-2  w-full">
                <label htmlFor="email" className="font-semibold text-sm">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  className=" bg-[#E2E5E5] h-14 rounded-lg p-4  w-full text-[#353344] text-sm"
                />
              </div>
              <button
                className="bg-[#427EF3] w-[31rem] rounded-lg h-12 mt-12 text-white"
                onClick={() => setStepTwo(true)}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EmailPasswordModal;
