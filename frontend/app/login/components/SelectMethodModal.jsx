import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

function SelectMethodModal({
  setShowModal,
  setMethod,
  setMobileMethod,
  setEmailMethod,
  emailMethod,
  mobileMethod
}) {
  if (emailMethod || mobileMethod) setShowModal(false);

  return (
    <div className="fixed inset-0  bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div
        className="bg-white pb-32
     w-[50rem] text-black p-10 pt-6 rounded shadow-lg max-w-xl flex justify-center  flex-col "
      >
        <button
          className=" self-end relative top-4 cursor-pointer"
          onClick={() => setShowModal(false)}
        >
          <IoClose className="w-8 h-8  " />
        </button>
        <h2 className="text-4xl font-bold mb-4 ">Recuperar contraseña</h2>
        <p className="mb-4 p-4 pt-0 pl-0 pr-6">
          Para continuar con el restablecimiento de tu contraseña pedimos que
          elijas una de las siguientes opciones de recuperación.
        </p>
        <div className="flex flex-col gap-2 justify-center items-center">
          <button
            onClick={() => setEmailMethod(true)}
            className="bg-[#7AA3F3] w-[31rem] rounded-lg h-14 my-2 text-white hover:bg-[#427EF3]"
          >
            Recuperación via Email
          </button>
          <button
            onClick={() => setMobileMethod(true)}
            className="bg-[#7AA3F3] w-[31em] rounded-lg h-14 my-2 text-white  hover:bg-[#427EF3]"
          >
            Recuperación via SMS
          </button>
          <button className="bg-[#427EF3] w-[31rem] rounded-lg h-12 mt-12 text-white">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectMethodModal;
