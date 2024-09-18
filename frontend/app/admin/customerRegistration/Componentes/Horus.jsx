"use client";
import { setHorus } from "@/lib/slices/newCustomerSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Horus() {
  const storeHorus = useSelector((state) => state.newCustomer.horus);
  const dispatch = useDispatch();
  console.log("store principales", storeHorus);
  const [horusInfo, setHorusInfo] = useState({
    saleHorusFrom: storeHorus?.saleHorusFrom || "",
    saleHorusTo: storeHorus?.saleHorusTo || "",
    marketingHorusFrom: storeHorus?.marketingHorusFrom || "",
    marketingHorusTo: storeHorus?.marketingHorusTo || "",
    onOffHorusFrom: storeHorus?.onOffHorusFrom || "",
    onOffHorusTo: storeHorus?.onOffHorusTo || "",
    customerAttention: storeHorus?.customerAttention || "",
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

    if (name === "customerAttention") {
      // Validar el input antes de actualizar el estado
      if (validateInput(value)) {
        // Actualizar el estado del objeto formState
        setHorusInfo((prevState) => ({
          ...prevState,
          [name]: value,
        }));
        dispatch(setHorus(horusInfo));
      } else {
        setErrorMessage({ error: "Caracteres inválidos en el campo." });

        // Limpiar el mensaje de error después de 3 segundos
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }
    } else {
      setHorusInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      dispatch(setHorus(horusInfo));
    }

    // Usar el valor actual directamente
    console.log("Current Input:", value);
  };

  return (
    <div className="w-4/5 h-auto flex flex-row gap-x-8 flex-wrap justify-start items-center ">
      {/**Horario de venta */}
      <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
        <label htmlFor="email" className="text-sm font-semibold">
          Horario de venta
        </label>
        <div className="flex flex-row justify-between items-center  w-11/12">
          <div className="bg-[#E2E5E5] rounded w-40 h-14 items-center  justify-center flex">
            <input
              type="time"
              name="saleHorusFrom"
              value={horusInfo?.saleHorusFrom}
              onChange={handleChange}
              className="bg-[#E2E5E5] rounded px-2 py-1  "
            />
            <span className="ml-2">hs</span>{" "}
            {/* Texto "HS" al lado del input */}
          </div>
          <span>hasta</span>
          <div className="bg-[#E2E5E5] rounded w-40 h-14 items-center  justify-center flex">
            <input
              type="time"
              name="saleHorusTo"
              value={horusInfo?.saleHorusTo}
              onChange={handleChange}
              className="bg-[#E2E5E5] rounded px-2 py-1  "
            />
            <span className="ml-2">hs</span>{" "}
            {/* Texto "HS" al lado del input */}
          </div>
        </div>
      </div>

      {/**Horario Publicitario */}
      <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
        <label htmlFor="email" className="text-sm font-semibold">
          Horario Publicitario
        </label>
        <div className="flex flex-row justify-between items-center  w-11/12">
          <div className="bg-[#E2E5E5] rounded w-40 h-14 items-center  justify-center flex">
            <input
              type="time"
              name="marketingHorusFrom"
              value={horusInfo?.marketingHorusFrom}
              onChange={handleChange}
              className="bg-[#E2E5E5] rounded px-2 py-1  "
            />
            <span className="ml-2">hs</span>{" "}
            {/* Texto "HS" al lado del input */}
          </div>
          <span>hasta</span>
          <div className="bg-[#E2E5E5] rounded w-40 h-14 items-center  justify-center flex">
            <input
              type="time"
              name="marketingHorusTo"
              value={horusInfo?.marketingHorusTo}
              onChange={handleChange}
              className="bg-[#E2E5E5] rounded px-2 py-1  "
            />
            <span className="ml-2">hs</span>{" "}
            {/* Texto "HS" al lado del input */}
          </div>
        </div>
      </div>
      {/**Horario On-Off de Dispositivos */}
      <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
        <label className="text-sm font-semibold">
          Horario On-Off de Dispositivos
        </label>
        <div className="flex flex-row justify-between items-center  w-11/12">
          <div className="bg-[#E2E5E5] rounded w-40 h-14 items-center  justify-center flex">
            <input
              type="time"
              name="onOffHorusFrom"
              value={horusInfo?.onOffHorusFrom}
              onChange={handleChange}
              className="bg-[#E2E5E5] rounded px-2 py-1  "
            />
            <span className="ml-2">hs</span>{" "}
            {/* Texto "HS" al lado del input */}
          </div>
          <span>hasta</span>
          <div className="bg-[#E2E5E5] rounded w-40 h-14 items-center  justify-center flex">
            <input
              type="time"
              name="onOffHorusTo"
              value={horusInfo?.onOffHorusTo}
              onChange={handleChange}
              className="bg-[#E2E5E5] rounded px-2 py-1  "
            />
            <span className="ml-2">hs</span>{" "}
            {/* Texto "HS" al lado del input */}
          </div>
        </div>
      </div>
      {/**  Atención al Cliente */}
      <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
        <label htmlFor="email" className="text-sm font-semibold">
          Atención al Cliente
        </label>
        <input
          type="text"
          name="customerAttention"
          value={horusInfo?.customerAttention}
          placeholder="Ingrese el numero de serie del dispositivo"
          required
          onChange={handleChange}
          className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
        />
      </div>
      {errorMessage.error && (
        <div
          className="p-2 h-8 text-xs rounded flex justify-center  
          items-center bg-red-700 text-white font-medium -top-8 relative "
        >
          {errorMessage.error}{" "}
        </div>
      )}
    </div>
  );
}

export default Horus;
