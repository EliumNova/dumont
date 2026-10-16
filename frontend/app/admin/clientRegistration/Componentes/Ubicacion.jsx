'use client';
import { setUbicacion } from '@/lib/slices/clients/clientSlice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Field from '../../components/Field';
import AddressAutocomplete from '../../components/AddressAutocomplete';
import { BotonesForm } from '../../components/FormCard';
import { validarFormulario, validarRequerido } from '@/lib/formato';

// OJO: estos nombres deben coincidir EXACTO (mayúsculas incluidas) con los
// atributos del modelo Clientes.js en el backend, si no, Sequelize los ignora
// en silencio y el alta del cliente queda incompleta.
const REGLAS = {
  Localidad: (v) => validarRequerido(v, 'La localidad'),
  Calle: (v) => validarRequerido(v, 'La calle'),
  Altura: (v) => (/^[0-9A-Za-z/ ]{1,10}$/.test(String(v).trim()) ? '' : 'Ingresá la altura (ej. 777 o S/N).'),
  EntreCalle1: (v) => validarRequerido(v, 'La primera entre calle'),
  EntreCalle2: (v) => validarRequerido(v, 'La segunda entre calle'),
  Latitud: (v) => (!v || (!Number.isNaN(Number(v)) && Math.abs(Number(v)) <= 90) ? '' : 'Latitud inválida (entre -90 y 90).'),
  Longitud: (v) => (!v || (!Number.isNaN(Number(v)) && Math.abs(Number(v)) <= 180) ? '' : 'Longitud inválida (entre -180 y 180).'),
};

// Separa un pegado tipo "-34.819743, -58.636132" (como se copia de Google Maps).
const splitCoordsPaste = (text) => {
  const m = text.trim().match(/^(-?\d+\.?\d*)\s*[,;]\s*(-?\d+\.?\d*)$/);
  return m ? { lat: m[1], lng: m[2] } : null;
};

function Ubicacion({ onNext, onBack }) {
  const store = useSelector((state) => state.clients.newCustomer.ubicacion);
  const dispatch = useDispatch();

  const [info, setInfo] = useState({
    Localidad: store?.Localidad || '',
    Calle: store?.Calle || '',
    Altura: store?.Altura || '',
    EntreCalle1: store?.EntreCalle1 || '',
    EntreCalle2: store?.EntreCalle2 || '',
    Latitud: store?.Latitud || '',
    Longitud: store?.Longitud || '',
  });
  const [errores, setErrores] = useState({});
  const [autocompletado, setAutocompletado] = useState(false);

  const cambiar = (e) => {
    const { name, value } = e.target;
    setInfo((p) => ({ ...p, [name]: value }));
    setErrores((er) => ({ ...er, [name]: '' }));
  };

  // Una sugerencia completa calle, altura, localidad y coordenadas de una vez.
  const alElegirDireccion = (d) => {
    setInfo((p) => ({
      ...p,
      Calle: d.Calle || p.Calle,
      Altura: d.Altura || p.Altura,
      Localidad: d.Localidad || p.Localidad,
      Latitud: d.Latitud || p.Latitud,
      Longitud: d.Longitud || p.Longitud,
    }));
    setErrores({});
    setAutocompletado(true);
  };

  const pegarCoordenadas = (e) => {
    const parsed = splitCoordsPaste(e.clipboardData.getData('text'));
    if (parsed) {
      e.preventDefault();
      setInfo((p) => ({ ...p, Latitud: parsed.lat, Longitud: parsed.lng }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validarFormulario(info, REGLAS);
    setErrores(errs);
    if (Object.keys(errs).length) return;
    dispatch(setUbicacion(info));
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <section className="mb-6">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Dirección</h3>
        <AddressAutocomplete onSelect={alElegirDireccion} className="mb-3" />
        {autocompletado && (
          <p className="mac-fade-up mb-3 rounded-xl bg-green-50 px-4 py-2 text-xs text-green-700">
            Dirección completada. Revisá los campos y agregá las entre calles.
          </p>
        )}
        <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
          <Field label="Localidad" name="Localidad" value={info.Localidad} error={errores.Localidad} onChange={cambiar} maxLength={45} />
          <Field label="Calle" name="Calle" value={info.Calle} error={errores.Calle} onChange={cambiar} maxLength={60} />
          <Field label="Altura" name="Altura" value={info.Altura} error={errores.Altura} onChange={cambiar} maxLength={10} placeholder="Ej. 777" />
          <span className="hidden sm:block" />
          <Field label="Entre calle 1" name="EntreCalle1" value={info.EntreCalle1} error={errores.EntreCalle1} onChange={cambiar} maxLength={45} />
          <Field label="Entre calle 2" name="EntreCalle2" value={info.EntreCalle2} error={errores.EntreCalle2} onChange={cambiar} maxLength={45} />
        </div>
      </section>

      <section className="mb-6">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Coordenadas (opcional)</h3>
        <p className="mb-3 text-xs text-gray-500">
          Se completan solas al elegir una dirección. Son el respaldo para el mapa; también podés pegar
          &quot;-34.819743, -58.636132&quot; en Latitud y se separan solas.
        </p>
        <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
          <Field label="Latitud" name="Latitud" value={info.Latitud} error={errores.Latitud} onChange={cambiar} onPaste={pegarCoordenadas} placeholder="-34.819743" />
          <Field label="Longitud" name="Longitud" value={info.Longitud} error={errores.Longitud} onChange={cambiar} placeholder="-58.636132" />
        </div>
      </section>

      <BotonesForm onCancel={onBack} cancelText="Atrás" submitText="Siguiente" />
    </form>
  );
}

export default Ubicacion;
