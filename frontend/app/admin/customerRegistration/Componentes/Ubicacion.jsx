import { setUbicacion } from '@/lib/slices/newCustomerSlice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function Ubicacion({ setInUbication, setProgress, setInPrincipales }) {
  const storeUbicacion = useSelector((state) => state.newCustomer.ubicacion);
  const dispatch = useDispatch();
  console.log('store ubicacion', storeUbicacion);
  const [ubicacionInfo, setUbicacionInfo] = useState({
    localidad: storeUbicacion?.localidad || '',
    calle: storeUbicacion?.calle || '',
    altura: storeUbicacion?.altura || '',
    email: storeUbicacion?.email || '',
    entreCalle1: storeUbicacion?.entreCalle1 || '',
    entreCalle2: storeUbicacion?.entreCalle2 || '',
  });

  const [errorMessage, setErrorMessage] = useState({ error: '' });

  // Función para validar el input (asegúrate de definir esta función)
  const validateInput = (value) => {
    // Ejemplo de validación simple
    return /^[a-zA-Z0-9@.]+$/.test(value);
  };

  // Función handleChange modificada
  const handleChange = (e) => {
    const { name, value } = e.target;

    const { localidad, calle, altura, email, entreCalle1, entreCalle2 } =
      ubicacionInfo;

    if (
      !localidad ||
      !calle ||
      !altura ||
      !email ||
      !entreCalle1 ||
      !entreCalle2
    ) {
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    }
    // Validar el input antes de actualizar el estado
    if (validateInput(value)) {
      // Actualizar el estado del objeto formState
      setUbicacionInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      dispatch(setUbicacion(ubicacionInfo));
    } else {
      setErrorMessage({ error: 'Caracteres inválidos en el campo.' });

      // Limpiar el mensaje de error después de 3 segundos
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const handleBack = () => {
    setInUbication(false);
    setInPrincipales(true);
    setProgress(33);
  };
  return (
    <div className="container mx-auto flex flex-col items-center gap-5">
      <div className="w-4/5 h-auto flex flex-row gap-x-8 flex-wrap justify-start items-center ">
        {/**Localidad */}
        <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
          <label htmlFor="email" className="text-sm font-semibold">
            Localidad
          </label>
          <input
            type="text"
            name="localidad"
            placeholder="Ingresa tu Localidad"
            value={ubicacionInfo?.localidad}
            required
            onChange={handleChange}
            className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
          />
        </div>

        {/**Calle */}
        <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
          <label htmlFor="email" className="text-sm font-semibold">
            Calle
          </label>
          <input
            type="text"
            name="calle"
            onChange={handleChange}
            value={ubicacionInfo?.calle}
            placeholder="Ingresa tu Calle"
            required
            className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
          />
        </div>
        {/**Altura */}
        <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
          <label className="text-sm font-semibold">Altura</label>
          <input
            onChange={handleChange}
            value={ubicacionInfo?.altura}
            type="text"
            name="altura"
            placeholder="Ingresa tu Altura"
            required
            className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
          />
        </div>
        {/**   Entre Calles */}
        <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
          <label htmlFor="email" className="text-sm font-semibold">
            Entre Calles
          </label>
          <div className="flex flex-row  items-center gap-2">
            <input
              onChange={handleChange}
              value={ubicacionInfo?.entreCalle1}
              type="text"
              name="entreCalle1"
              placeholder="Calle 1"
              required
              className=" w-1/2 bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
            />

            <input
              type="text"
              name="entreCalle2"
              onChange={handleChange}
              value={ubicacionInfo?.entreCalle2}
              placeholder="Calle 2"
              required
              className=" w-1/2 bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
            />
          </div>
        </div>
      </div>
      <div>
        {/* Mensaje de error */}
        {errorMessage.error && (
          <div
            className="p-2 h-8 text-xs rounded flex justify-center  
          items-center bg-red-700 text-white font-medium -top-8 relative "
          >
            {errorMessage.error}{' '}
          </div>
        )}
        <div className="flex gap-5">
          <button
            onClick={handleBack}
            className="w-[15rem] h-14 relative top-11
          bg-transparent border-principal border-2 rounded-xl text-principal text-lg tracking-wide font-semibold"
          >
            Atras
          </button>
          <button
            // onClick={handleSubmit}
            className="w-[15rem] h-14 relative top-11 bg-[#427EF3] rounded-xl text-white text-lg tracking-wide font-semibold"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Ubicacion;
