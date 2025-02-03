import { setUbicacion } from '@/lib/slices/newCustomerSlice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function Ubicacion({
  setInHorus,
  setProgress,
  setInPrincipales,
  setInUbication,
}) {
  const storeUbicacion = useSelector((state) => state.newCustomer.ubicacion);
  const dispatch = useDispatch();

  const [ubicacionInfo, setUbicacionInfo] = useState({
    localidad: storeUbicacion?.localidad || '',
    calle: storeUbicacion?.calle || '',
    altura: storeUbicacion?.altura || '',
    entreCalle1: storeUbicacion?.entreCalle1 || '',
    entreCalle2: storeUbicacion?.entreCalle2 || '',
    latitud: storeUbicacion?.latitud || '',
    longitud: storeUbicacion?.longitud || '',
  });

  const [errorMessage, setErrorMessage] = useState({ error: '' });

  // Función para validar el input (asegúrate de definir esta función)
  const validateInput = (value) => {
    // Ejemplo de validación simple
    return /^[a-zA-Z0-9@.\s-]+$/.test(value);
  };

  // Función handleChange modificada
  const handleChange = (e) => {
    const { name, value } = e.target;

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

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(ubicacionInfo);

    const { localidad, calle, altura, entreCalle1, entreCalle2 } =
      ubicacionInfo;

    console.log(ubicacionInfo);
    if (!localidad || !calle || !altura || !entreCalle1 || !entreCalle2) {
      setErrorMessage({ error: 'Todos los campos son obligatorios.' });
      return;
    }
    // Si todas las validaciones pasan, enviar datos
    dispatch(setUbicacion(ubicacionInfo));
    console.log(ubicacionInfo);
    setInUbication(false);
    setInHorus(true);
    setProgress(100);
    // setErrorMessage('');
  };
  return (
    <div className="h-full mx-auto flex flex-col items-center w-full">
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 w-full">
        {/** Localidad */}
        <div className="flex flex-col  w-full">
          <label htmlFor="localidad" className="text-sm font-semibold">
            Localidad
          </label>
          <input
            type="text"
            name="localidad"
            placeholder="Ingresa tu Localidad"
            value={ubicacionInfo?.localidad}
            required
            onChange={handleChange}
            className="bg-[#E2E5E5] h-14 rounded-lg p-4 text-base w-full text-black"
          />
        </div>

        {/** Calle */}
        <div className="flex flex-col  w-full">
          <label htmlFor="calle" className="text-sm font-semibold">
            Calle
          </label>
          <input
            type="text"
            name="calle"
            onChange={handleChange}
            value={ubicacionInfo?.calle}
            placeholder="Ingresa tu Calle"
            required
            className="bg-[#E2E5E5] h-14 rounded-lg p-4 text-base w-full text-black"
          />
        </div>

        {/** Altura */}
        <div className="flex flex-col  w-full">
          <label className="text-sm font-semibold">Altura</label>
          <input
            onChange={handleChange}
            value={ubicacionInfo?.altura}
            type="text"
            name="altura"
            placeholder="Ingresa tu Altura"
            required
            className="bg-[#E2E5E5] h-14 rounded-lg p-4 text-base w-full text-black"
          />
        </div>

        {/** Entre Calles */}
        <div className="flex flex-col  w-full">
          <label htmlFor="entreCalle" className="text-sm font-semibold">
            Entre Calles
          </label>
          <div className="flex flex-row items-center gap-2">
            <input
              onChange={handleChange}
              value={ubicacionInfo?.entreCalle1}
              type="text"
              name="entreCalle1"
              placeholder="Calle 1"
              required
              className="w-1/2 bg-[#E2E5E5] h-14 rounded-lg p-4 text-base text-black"
            />

            <input
              type="text"
              name="entreCalle2"
              onChange={handleChange}
              value={ubicacionInfo?.entreCalle2}
              placeholder="Calle 2"
              required
              className="w-1/2 bg-[#E2E5E5] h-14 rounded-lg p-4 text-base text-black"
            />
          </div>
        </div>

        {/** Latitud */}
        <div className="flex flex-col  w-full">
          <label htmlFor="latitud" className="text-sm font-semibold">
            Latitud
          </label>
          <input
            type="text"
            name="latitud"
            onChange={handleChange}
            value={ubicacionInfo?.latitud}
            placeholder="Ingresa la Latitud"
            required
            className="bg-[#E2E5E5] h-14 rounded-lg p-4 text-base w-full text-black"
          />
        </div>

        {/** Longitud */}
        <div className="flex flex-col  w-full">
          <label htmlFor="longitud" className="text-sm font-semibold">
            Longitud
          </label>
          <input
            type="text"
            name="longitud"
            onChange={handleChange}
            value={ubicacionInfo?.longitud}
            placeholder="Ingresa la Longitud"
            required
            className="bg-[#E2E5E5] h-14 rounded-lg p-4 text-base w-full text-black"
          />
        </div>
      </div>

      <div className="mt-8">
        {/* Mensaje de error */}
        {errorMessage.error && (
          <div className="p-2 h-8 text-xs rounded flex justify-center items-center bg-red-700 text-white font-medium my-4">
            {errorMessage.error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-5  w-full justify-items-center">
          <button
            onClick={handleBack}
            className="w-[15rem] h-14 bg-transparent border-principal border-2 rounded-xl text-principal text-lg tracking-wide font-semibold"
          >
            Atrás
          </button>
          <button
            onClick={handleSubmit}
            className="w-[15rem] h-14 bg-[#427EF3] rounded-xl text-white text-lg tracking-wide font-semibold"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Ubicacion;
