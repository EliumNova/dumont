'use client';
import { setUbicacion } from '@/lib/slices/clients/clientSlice'; // Importa la acción desde el slice combinado
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Orden real de navegación (izquierda a derecha, arriba a abajo) del formulario.
// Se usa para que la tecla Enter avance al siguiente campo en este orden, en vez
// de disparar el submit nativo del form (que hace que el navegador salte al
// primer campo "required" vacío, generalmente Localidad).
// OJO: estos nombres deben coincidir EXACTO (mayúsculas incluidas) con los
// atributos del modelo Clientes.js en el backend, si no, Sequelize los
// ignora en silencio y el alta del cliente queda incompleta.
const FIELD_ORDER = [
  'Localidad',
  'Calle',
  'Altura',
  'EntreCalle1',
  'EntreCalle2',
  'Latitud',
  'Longitud',
];

// Intenta separar un pegado tipo "-34.819743, -58.636132" (formato típico al
// copiar una ubicación de Google Maps) en sus dos componentes.
const splitCoordsPaste = (text) => {
  const match = text
    .trim()
    .match(/^(-?\d+\.?\d*)\s*[,;]\s*(-?\d+\.?\d*)$/);
  if (!match) return null;
  return { lat: match[1], lng: match[2] };
};

function Ubicacion({ onNext, onBack }) {
  const storeUbicacion = useSelector(
    (state) => state.clients.newCustomer.ubicacion
  ); // Accede al estado desde el slice combinado
  const dispatch = useDispatch();

  const [ubicacionInfo, setUbicacionInfo] = useState({
    Localidad: storeUbicacion?.Localidad || '',
    Calle: storeUbicacion?.Calle || '',
    Altura: storeUbicacion?.Altura || '',
    EntreCalle1: storeUbicacion?.EntreCalle1 || '',
    EntreCalle2: storeUbicacion?.EntreCalle2 || '',
    Latitud: storeUbicacion?.Latitud || '',
    Longitud: storeUbicacion?.Longitud || '',
  });

  const [errorMessage, setErrorMessage] = useState({ error: '' });

  const fieldRefs = useRef({});

  const handleFieldKeyDown = (e, fieldName) => {
    if (e.key !== 'Enter') return;
    e.preventDefault(); // Evita el submit nativo (y el salto de foco a Localidad)

    const currentIndex = FIELD_ORDER.indexOf(fieldName);
    const nextField = FIELD_ORDER[currentIndex + 1];

    if (nextField && fieldRefs.current[nextField]) {
      fieldRefs.current[nextField].focus();
    } else {
      // Último campo: intenta avanzar al siguiente paso
      handleNextStep(e);
    }
  };

  // Función para validar el input de texto (dirección)
  const validateInput = (value) => {
    return /^[a-zA-Z0-9@.\s-]+$/.test(value);
  };

  // Las coordenadas permiten números negativos y punto decimal
  const validateCoord = (value) => {
    return /^-?[0-9.]*$/.test(value);
  };

  // Función handleChange modificada
  const handleChange = (e) => {
    const { name, value } = e.target;
    const isCoordField = name === 'Latitud' || name === 'Longitud';

    // Validar el input antes de actualizar el estado
    if (isCoordField ? validateCoord(value) : validateInput(value)) {
      // Actualizar el estado del objeto formState
      setUbicacionInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setErrorMessage({ error: 'Caracteres inválidos en el campo.' });

      // Limpiar el mensaje de error después de 3 segundos
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  // Si el vendedor pega "lat, lng" directo en el campo Latitud (formato que
  // se copia de Google Maps), lo separamos automáticamente en los dos campos.
  const handleLatitudPaste = (e) => {
    const pasted = e.clipboardData.getData('text');
    const parsed = splitCoordsPaste(pasted);
    if (parsed) {
      e.preventDefault();
      setUbicacionInfo((prev) => ({
        ...prev,
        Latitud: parsed.lat,
        Longitud: parsed.lng,
      }));
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();

    const { Localidad, Calle, Altura, EntreCalle1, EntreCalle2 } =
      ubicacionInfo;

    // Validar campos obligatorios (las coordenadas son opcionales: son un
    // respaldo, no siempre el vendedor las tiene a mano)
    if (!Localidad || !Calle || !Altura || !EntreCalle1 || !EntreCalle2) {
      setErrorMessage({ error: 'Todos los campos son obligatorios.' });
      return;
    }

    // Si todas las validaciones pasan, guardar datos en Redux y avanzar al siguiente paso
    dispatch(setUbicacion(ubicacionInfo)); // Guarda los datos en Redux
    onNext(); // Navega al siguiente paso
  };

  return (
    <form
      onSubmit={handleNextStep}
      className="h-full mx-auto flex flex-col items-center w-full"
    >
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 w-full text-white">
        {/** Localidad */}
        <div className="flex flex-col w-full">
          <label htmlFor="Localidad" className="text-sm font-semibold">
            Localidad
          </label>
          <input
            type="text"
            name="Localidad"
            placeholder="Ingresa tu Localidad"
            value={ubicacionInfo?.Localidad}
            onChange={handleChange}
            onKeyDown={(e) => handleFieldKeyDown(e, 'Localidad')}
            ref={(el) => (fieldRefs.current.Localidad = el)}
            className="bg-[#E2E5E5] h-14 rounded-lg p-4 text-base w-full text-black"
          />
        </div>

        {/** Calle */}
        <div className="flex flex-col w-full">
          <label htmlFor="Calle" className="text-sm font-semibold">
            Calle
          </label>
          <input
            type="text"
            name="Calle"
            onChange={handleChange}
            value={ubicacionInfo?.Calle}
            placeholder="Ingresa tu Calle"
            onKeyDown={(e) => handleFieldKeyDown(e, 'Calle')}
            ref={(el) => (fieldRefs.current.Calle = el)}
            className="bg-[#E2E5E5] h-14 rounded-lg p-4 text-base w-full text-black"
          />
        </div>

        {/** Altura */}
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold">Altura</label>
          <input
            onChange={handleChange}
            value={ubicacionInfo?.Altura}
            type="text"
            name="Altura"
            placeholder="Ingresa tu Altura"
            onKeyDown={(e) => handleFieldKeyDown(e, 'Altura')}
            ref={(el) => (fieldRefs.current.Altura = el)}
            className="bg-[#E2E5E5] h-14 rounded-lg p-4 text-base w-full text-black"
          />
        </div>

        {/** Entre Calles */}
        <div className="flex flex-col w-full">
          <label htmlFor="entreCalle" className="text-sm font-semibold">
            Entre Calles
          </label>
          <div className="flex flex-row items-center gap-2">
            <input
              onChange={handleChange}
              value={ubicacionInfo?.EntreCalle1}
              type="text"
              name="EntreCalle1"
              placeholder="Calle 1"
              onKeyDown={(e) => handleFieldKeyDown(e, 'EntreCalle1')}
              ref={(el) => (fieldRefs.current.EntreCalle1 = el)}
              className="w-1/2 bg-[#E2E5E5] h-14 rounded-lg p-4 text-base text-black"
            />
            <input
              type="text"
              name="EntreCalle2"
              onChange={handleChange}
              value={ubicacionInfo?.EntreCalle2}
              placeholder="Calle 2"
              onKeyDown={(e) => handleFieldKeyDown(e, 'EntreCalle2')}
              ref={(el) => (fieldRefs.current.EntreCalle2 = el)}
              className="w-1/2 bg-[#E2E5E5] h-14 rounded-lg p-4 text-base text-black"
            />
          </div>
        </div>

        {/** Coordenadas (respaldo para el mapa) */}
        <div className="flex flex-col w-full sm:col-span-2">
          <label className="text-sm font-semibold">
            Coordenadas (opcional, respaldo para el mapa)
          </label>
          <div className="flex flex-row items-center gap-2">
            <input
              onChange={handleChange}
              onPaste={handleLatitudPaste}
              value={ubicacionInfo?.Latitud}
              type="text"
              name="Latitud"
              placeholder="Latitud (ej. -34.819743)"
              onKeyDown={(e) => handleFieldKeyDown(e, 'Latitud')}
              ref={(el) => (fieldRefs.current.Latitud = el)}
              className="w-1/2 bg-[#E2E5E5] h-14 rounded-lg p-4 text-base text-black"
            />
            <input
              onChange={handleChange}
              value={ubicacionInfo?.Longitud}
              type="text"
              name="Longitud"
              placeholder="Longitud (ej. -58.636132)"
              onKeyDown={(e) => handleFieldKeyDown(e, 'Longitud')}
              ref={(el) => (fieldRefs.current.Longitud = el)}
              className="w-1/2 bg-[#E2E5E5] h-14 rounded-lg p-4 text-base text-black"
            />
          </div>
          <span className="text-xs text-gray-300 mt-1">
            Se pueden pegar juntas (ej. &quot;-34.819743, -58.636132&quot;) en el campo
            Latitud y se separan solas.
          </span>
        </div>
      </div>

      <div className="mt-8">
        {/* Mensaje de error */}
        {errorMessage.error && (
          <div className="p-2 h-8 text-xs rounded flex justify-center items-center bg-red-700 text-white font-medium my-4">
            {errorMessage.error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-5 w-full justify-items-center">
          <button
            type="button"
            onClick={onBack}
            className="w-[15rem] h-14 bg-transparent border-principal border-2 rounded-xl text-principal text-lg tracking-wide font-semibold"
          >
            Atrás
          </button>
          <button
            type="submit"
            className="w-[15rem] h-14 bg-[#427EF3] rounded-xl text-white text-lg tracking-wide font-semibold"
          >
            Siguiente
          </button>
        </div>
      </div>
    </form>
  );
}

export default Ubicacion;
