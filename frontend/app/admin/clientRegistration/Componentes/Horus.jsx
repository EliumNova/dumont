'use client';
import { setHorus } from '@/lib/slices/clients/clientSlice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function Horus({ onSubmit, onBack, setShowModal }) {
  const storeHorus = useSelector((state) => state.clients.newCustomer.horus);
  const dispatch = useDispatch();

  const [horusInfo, setHorusInfo] = useState({
    saleHorusFrom: storeHorus?.saleHorusFrom || '',
    saleHorusTo: storeHorus?.saleHorusTo || '',
    closeHorusFrom: storeHorus?.closeHorusFrom || '',
    closeHorusTo: storeHorus?.closeHorusTo || '',
  });

  const [errorMessage, setErrorMessage] = useState({ error: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHorusInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBack = () => {
    onBack();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { saleHorusFrom, saleHorusTo, closeHorusFrom, closeHorusTo } =
      horusInfo;

    // Validación: mínimo debe estar el horario de apertura completo
    if (!saleHorusFrom || !saleHorusTo) {
      setErrorMessage({
        error: 'Debe completarse el horario de apertura (Desde y Hasta).',
      });
      return;
    }

    // Validación: si completaron solo uno de los dos campos de cierre
    if (
      (closeHorusFrom && !closeHorusTo) ||
      (!closeHorusFrom && closeHorusTo)
    ) {
      setErrorMessage({
        error:
          'Debe completar ambos campos de horario de cierre (Desde y Hasta), o dejar ambos vacíos.',
      });
      return;
    }

    // Construimos el horarioVenta
    let horarioVenta = `${saleHorusFrom} - ${saleHorusTo}`;

    if (closeHorusFrom && closeHorusTo) {
      horarioVenta += ` / ${closeHorusFrom} - ${closeHorusTo}`;
    }

    const formattedData = {
      HorarioVenta: horarioVenta,
    };

    dispatch(setHorus(formattedData));
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-full flex flex-col items-center w-full"
    >
      <div className="flex flex-col w-full max-w-xl gap-8 text-white items-center">
        {/* Horario de apertura */}
        <div className="flex flex-col items-center w-full gap-4">
          <h2 className="text-lg font-bold">Horario de apertura</h2>
          <div className="flex flex-row justify-center items-center gap-4 w-full">
            <div className="flex flex-col items-center">
              <label className="text-sm">Desde</label>
              <input
                type="time"
                name="saleHorusFrom"
                value={horusInfo.saleHorusFrom}
                onChange={handleChange}
                className="bg-[#E2E5E5] rounded px-2 py-1 text-black w-40"
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="text-sm">Hasta</label>
              <input
                type="time"
                name="saleHorusTo"
                value={horusInfo.saleHorusTo}
                onChange={handleChange}
                className="bg-[#E2E5E5] rounded px-2 py-1 text-black w-40"
              />
            </div>
          </div>
        </div>

        {/* Horario de cierre */}
        <div className="flex flex-col items-center w-full gap-4">
          <h2 className="text-lg font-bold">Horario de cierre (opcional)</h2>
          <div className="flex flex-row justify-center items-center gap-4 w-full">
            <div className="flex flex-col items-center">
              <label className="text-sm">Desde</label>
              <input
                type="time"
                name="closeHorusFrom"
                value={horusInfo.closeHorusFrom}
                onChange={handleChange}
                className="bg-[#E2E5E5] rounded px-2 py-1 text-black w-40"
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="text-sm">Hasta</label>
              <input
                type="time"
                name="closeHorusTo"
                value={horusInfo.closeHorusTo}
                onChange={handleChange}
                className="bg-[#E2E5E5] rounded px-2 py-1 text-black w-40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {errorMessage.error && (
        <div className="p-2 h-8 text-xs rounded flex justify-center items-center bg-red-700 text-white font-medium my-4">
          {errorMessage.error}
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-5 flex-col md:flex-row my-6">
        <button
          type="button"
          onClick={handleBack}
          className="w-[15rem] h-14 bg-transparent border-principal border-2 rounded-xl text-principal text-lg tracking-wide font-semibold"
        >
          Atrás
        </button>
        <button className="w-[15rem] h-14 bg-[#427EF3] rounded-xl text-white text-lg tracking-wide font-semibold">
          Guardar cambios
        </button>
      </div>
    </form>
  );
}

export default Horus;
