import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function CompleteModal({ setShowModal }) {
  
  return (
    <div className="fixed inset-0  bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div
        className="bg-white pb-32
     w-[40rem] h-[25rem] text-black p-10 pt-6 rounded-[20px] shadow-lg max-w-xl flex justify-start  flex-col "
      >
        <button
          className=" self-end relative top-4 cursor-pointer"
          onClick={() => setShowModal(false)}
        >
          <IoClose className="w-8 h-8  " />
        </button>
        <div className=" flex flex-col gap-6 items-center justify-center my-16">
            <div className="w-36 h-36 rounded-full bg-[#427EF3] flex items-center justify-center">
              <FaCheck className="text-white w-24 h-24" />
            </div>
            <h3 className="text-2xl font-bold m-auto ">
              ¡Cliente creado con exito!
            </h3>
          </div>
      </div>
    </div>
  );
}

export default CompleteModal;
