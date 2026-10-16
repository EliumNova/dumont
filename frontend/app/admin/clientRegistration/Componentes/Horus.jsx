'use client';
import { setHorus } from '@/lib/slices/clients/clientSlice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Field from '../../components/Field';
import { BotonesForm } from '../../components/FormCard';

function Horus({ onSubmit, onBack, enviando }) {
  const storeHorus = useSelector((state) => state.clients.newCustomer.horus);
  const dispatch = useDispatch();

  const [info, setInfo] = useState({
    saleHorusFrom: storeHorus?.saleHorusFrom || '',
    saleHorusTo: storeHorus?.saleHorusTo || '',
    closeHorusFrom: storeHorus?.closeHorusFrom || '',
    closeHorusTo: storeHorus?.closeHorusTo || '',
  });
  const [errores, setErrores] = useState({});

  const cambiar = (e) => {
    const { name, value } = e.target;
    setInfo((p) => ({ ...p, [name]: value }));
    setErrores((er) => ({ ...er, [name]: '', general: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { saleHorusFrom, saleHorusTo, closeHorusFrom, closeHorusTo } = info;
    const errs = {};
    if (!saleHorusFrom) errs.saleHorusFrom = 'Indicá la hora de apertura.';
    if (!saleHorusTo) errs.saleHorusTo = 'Indicá la hora de cierre.';
    // Segundo turno: o se completan ambos campos o ninguno.
    if (closeHorusFrom && !closeHorusTo) errs.closeHorusTo = 'Completá también el cierre del segundo turno.';
    if (!closeHorusFrom && closeHorusTo) errs.closeHorusFrom = 'Completá también la apertura del segundo turno.';
    setErrores(errs);
    if (Object.keys(errs).length) return;

    let horario = `${saleHorusFrom} - ${saleHorusTo}`;
    if (closeHorusFrom && closeHorusTo) horario += ` / ${closeHorusFrom} - ${closeHorusTo}`;

    dispatch(setHorus({ HorarioVenta: horario }));
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <section className="mb-6">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Horario principal</h3>
        <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
          <Field type="time" label="Desde" name="saleHorusFrom" value={info.saleHorusFrom} error={errores.saleHorusFrom} onChange={cambiar} />
          <Field type="time" label="Hasta" name="saleHorusTo" value={info.saleHorusTo} error={errores.saleHorusTo} onChange={cambiar} />
        </div>
      </section>

      <section className="mb-6">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Segundo turno (opcional)</h3>
        <p className="mb-3 text-xs text-gray-500">Para negocios que cierran al mediodía y vuelven a abrir a la tarde.</p>
        <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
          <Field type="time" label="Desde" name="closeHorusFrom" value={info.closeHorusFrom} error={errores.closeHorusFrom} onChange={cambiar} />
          <Field type="time" label="Hasta" name="closeHorusTo" value={info.closeHorusTo} error={errores.closeHorusTo} onChange={cambiar} />
        </div>
      </section>

      <BotonesForm onCancel={onBack} cancelText="Atrás" submitText="Registrar cliente" loading={enviando} />
    </form>
  );
}

export default Horus;
