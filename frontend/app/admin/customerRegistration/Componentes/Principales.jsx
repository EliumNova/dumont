import { setPrincipales } from "@/lib/slices/newCustomerSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Principales() {
  const storePrincipales = useSelector(
    (state) => state.newCustomer.principales
  );
  const dispatch = useDispatch();
  console.log("store principales", storePrincipales);
  const [principalesInfo, setPrincipalesInfo] = useState({
    customerCode: storePrincipales?.customerCode || "",
    segmentacion: storePrincipales?.segmentacion || "",
    codeDistribuidor: storePrincipales?.codeDistribuidor || "",
    email: storePrincipales?.email || "",
    webPage: storePrincipales?.webPage || "",
    alcoholAccess: storePrincipales?.alcoholAccess || "",
    phone: storePrincipales?.phone || "",
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
      setPrincipalesInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      dispatch(setPrincipales(principalesInfo));
    } else {
      setErrorMessage({ error: "Caracteres inválidos en el campo." });

      // Limpiar el mensaje de error después de 3 segundos
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }

  };

  return (
    <div
      className="w-4/5 h-auto flex flex-row gap-x-8 flex-wrap justify-start items-center 
"
    >
      {/**código del cliente */}
      <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
        <label htmlFor="email" className="text-sm font-semibold">
          Código del cliente
        </label>
        <input
          type="number"
          name="customerCode"
          placeholder="Ingresa tu numero de cliente"
          value={principalesInfo?.customerCode}
          required
          className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
          onChange={handleChange}
        />
      </div>

      {/**Segmentacion */}
      <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
        <label htmlFor="email" className="text-sm font-semibold">
          Segmentación
        </label>
        <select
          id="admin"
          className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
          required
          name="segmentacion"
          value={principalesInfo?.segmentacion}
          onChange={handleChange}
        >
          <option value="kiosco">Kiosco</option>
          <option value="no">No</option>
        </select>
      </div>
      {/**código del distribuidor */}
      <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
        <label htmlFor="email" className="text-sm font-semibold">
          Código del distribuidor
        </label>
        <input
          type="text"
          name="codeDistribuidor"
          value={principalesInfo?.codeDistribuidor}
          placeholder="Ingresa tu numero de cliente"
          onChange={handleChange}
          required
          className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
        />
      </div>
      {/**Correo electrónico */}
      <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
        <label htmlFor="email" className="text-sm font-semibold">
          Correo electrónico
        </label>
        <input
          type="email"
          name="email"
          value={principalesInfo?.email}
          onChange={handleChange}
          placeholder="Ingresa tu correo electrónico"
          required
          className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
        />
      </div>
      {/**Pagina web */}
      <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
        <label htmlFor="email" className="text-sm font-semibold">
          Página Web
        </label>
        <input
          type="text"
          name="webPage"
          value={principalesInfo?.webPage}
          onChange={handleChange}
          placeholder="Ingresa tu página web"
          required
          className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
        />
      </div>
      {/**Permiso de venta de alcohol*/}
      <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
        <label htmlFor="email" className="text-sm font-semibold">
          Permiso Venta Alchohol
        </label>
        <select
          name="alcoholAccess"
          value={principalesInfo?.alcoholAccess}
          className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
          required
          onChange={handleChange}
        >
          <option value="si">Si</option>
          <option value="no">No</option>
        </select>
      </div>
      {/**Teléfono */}
      <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
        <label htmlFor="email" className="text-sm font-semibold">
          Teléfono
        </label>
        <input
          type="number"
          id="name"
          name="phone"
          onChange={handleChange}

          value={principalesInfo?.phone}
          placeholder="Ingresa tu numero de  teléfono"
          required
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

export default Principales;
