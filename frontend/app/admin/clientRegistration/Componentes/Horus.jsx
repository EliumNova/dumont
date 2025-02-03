'use client';
import { setHorus } from '@/lib/slices/newCustomerSlice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

function Horus({ setInHorus, setProgress, setInUbication, setShowModal }) {
  const router = useRouter();
  const storeHorus = useSelector((state) => state.newCustomer.horus);
  const dispatch = useDispatch();
  console.log('store principales', storeHorus);
  const [horusInfo, setHorusInfo] = useState({
    saleHorusFrom: storeHorus?.saleHorusFrom || '',
    saleHorusTo: storeHorus?.saleHorusTo || '',
    marketingHorusFrom: storeHorus?.marketingHorusFrom || '',
    marketingHorusTo: storeHorus?.marketingHorusTo || '',
    onOffHorusFrom: storeHorus?.onOffHorusFrom || '',
    onOffHorusTo: storeHorus?.onOffHorusTo || '',
    customerAttention: storeHorus?.customerAttention || '',
  });

  const [errorMessage, setErrorMessage] = useState({ error: '' });

  // Función para validar el input (asegúrate de definir esta función)
  const validateInput = (value) => {
    // Ejemplo de validación simple
    return /^[a-zA-Z0-9@.]+$/.test(value);
  };

  const handleBack = () => {
    setInUbication(true);
    setInHorus(false);
    setProgress(66);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { saleHorusFrom, saleHorusTo, onOffHorusFrom, onOffHorusTo } =
      horusInfo;

    if (!saleHorusFrom || !saleHorusTo || !onOffHorusFrom || !onOffHorusTo) {
      setErrorMessage({ error: 'Todos los campos son obligatorios.' });
      return;
    }
    // // Si todas las validaciones pasan, enviar datos
    dispatch(setHorus(horusInfo));
    setShowModal(true);
    setTimeout(() => {
      router.push('/admin/');
    }, 3000);
  };
  // Función handleChange modificada
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'customerAttention') {
      // Validar el input antes de actualizar el estado
      if (validateInput(value)) {
        // Actualizar el estado del objeto formState
        setHorusInfo((prevState) => ({
          ...prevState,
          [name]: value,
        }));
        dispatch(setHorus(horusInfo));
      } else {
        setErrorMessage({ error: 'Caracteres inválidos en el campo.' });

        // Limpiar el mensaje de error después de 3 segundos
        setTimeout(() => {
          setErrorMessage('');
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
    console.log('Current Input:', value);
  };

  return (
    <div className="h-full flex flex-col items-center w-full">
      <div className="flex flex-row w-full gap-5 ">
        {/**Horario de venta */}
        <div className="flex flex-col gap-3 w-full p-4">
          <label htmlFor="email" className="text-sm font-semibold">
            Horario de venta:
          </label>
          <div className="md:flex">
            <div className="bg-[#E2E5E5] rounded h-14 items-center  justify-center flex w-[60%]">
              <input
                type="time"
                name="saleHorusFrom"
                value={horusInfo?.saleHorusFrom}
                onChange={handleChange}
                className="bg-[#E2E5E5] rounded px-2 py-1 text-black"
              />
              <span className="ml-2 text-black">hs</span>{' '}
              {/* Texto "HS" al lado del input */}
            </div>
            <span className="md:mx-5 ">Hasta:</span>
            <div className="bg-[#E2E5E5] rounded h-14 items-center  justify-center flex w-[60%]">
              <input
                type="time"
                name="saleHorusTo"
                value={horusInfo?.saleHorusTo}
                onChange={handleChange}
                className="bg-[#E2E5E5] rounded px-2 py-1 text-black"
              />
              <span className="ml-2 text-black">hs</span>{' '}
              {/* Texto "HS" al lado del input */}
            </div>
          </div>
        </div>
        {/**Horario On-Off de Dispositivos */}
        <div className="flex flex-col gap-3 w-full p-4">
          <label className="text-sm font-semibold">
            Horario On-Off de Dispositivos:
          </label>
          <div className="grid grid-cols-1 w-full md:flex">
            <div className="bg-[#E2E5E5] rounded h-14 items-center  justify-center flex w-[60%]">
              <input
                type="time"
                name="onOffHorusFrom"
                value={horusInfo?.onOffHorusFrom}
                onChange={handleChange}
                className="bg-[#E2E5E5] rounded px-2 py-1 text-black"
              />
              <span className="ml-2 text-black">hs</span>{' '}
              {/* Texto "HS" al lado del input */}
            </div>
            <span className="md:mx-5 ">Hasta:</span>
            <div className="bg-[#E2E5E5] rounded h-14 items-center  justify-center flex w-[60%]">
              <input
                type="time"
                name="onOffHorusTo"
                value={horusInfo?.onOffHorusTo}
                onChange={handleChange}
                className="bg-[#E2E5E5] rounded px-2 py-1 text-black"
              />
              <span className="ml-2 text-black">hs</span>{' '}
              {/* Texto "HS" al lado del input */}
            </div>
          </div>
        </div>
      </div>
      <div className="">
        {/* Mensaje de error */}
        {errorMessage.error && (
          <div
            className="p-2 h-8 text-xs rounded flex justify-center
          items-center bg-red-700 text-white font-medium my-4 "
          >
            {errorMessage.error}{' '}
          </div>
        )}
        <div className="flex gap-5 flex-col md:flex-row">
          <button
            onClick={handleBack}
            className="w-[15rem] h-14
          bg-transparent border-principal border-2 rounded-xl text-principal text-lg tracking-wide font-semibold"
          >
            Atras
          </button>
          <button
            onClick={handleSubmit}
            className="w-[15rem] h-14  bg-[#427EF3] rounded-xl text-white text-lg tracking-wide font-semibold"
          >
            Guardas cambios
          </button>
        </div>
      </div>
    </div>
  );
}

export default Horus;
