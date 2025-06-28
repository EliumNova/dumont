'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { setLoading, setError } from '@/lib/slices/clients/clientSlice';
import CompleteModal from '../../components/CompleteModal';

function CustomerEdition() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Extraer el id de la URL

  const [showModal, setShowModal] = useState(false); // Estado del modal de éxito
  const [customerInfo, setCustomerInfo] = useState({
    principales: {
      NombreCompleto: '',
      CodigoCliente: '',
    },
    ubicacion: {
      localidad: '',
      calle: '',
    },
    horus: {
      saleHorusFrom: '',
      saleHorusTo: '',
    },
  });
  const [loading, setLoading] = useState(true); // Estado de carga

  // Cargar datos del cliente basados en el id
  useEffect(() => {
    if (id) {
      const fetchCustomerData = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/clientes/${id}`
          );
          const data = response.data;

          // Inicializar customerInfo con los datos cargados
          setCustomerInfo({
            principales: {
              NombreCompleto: data.NombreCompleto,
              CodigoCliente: data.CodigoCliente,
              Segmentacion: data.Segmentacion,
              CodigoDistribuidor: data.CodigoDistribuidor,
              CodigoDumont: data.CodigoDumont,
              CorreoElectronico: data.CorreoElectronico,
              WebPage: data.WebPage,
              VentaAlcohol: data.VentaAlcohol,
              Telefono: data.Telefono,
            },
            ubicacion: {
              localidad: data.localidad,
              calle: data.calle,
              altura: data.altura,
              entreCalle1: data.entreCalle1,
              entreCalle2: data.entreCalle2,
            },
            horus: {
              saleHorusFrom: data.HorarioVenta.split(' - ')[0], // Ejemplo de cómo manejar campos compuestos
              saleHorusTo: data.HorarioVenta.split(' - ')[1],
            },
          });
        } catch (error) {
          console.error('Error al cargar los datos del cliente:', error);
          dispatch(setError('Error al cargar los datos del cliente'));
        } finally {
          setLoading(false);
        }
      };

      fetchCustomerData();
    }
  }, [id, dispatch]);

  const handleChange = (section, field, value) => {
    setCustomerInfo((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...customerInfo.principales,
        ...customerInfo.ubicacion,
        ...customerInfo.horus,
      };

      dispatch(setLoading(true));
      console.log('Enviando solicitud a la API:', URL);
      console.log('Datos enviados:', payload);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clientes/update/${id}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Respuesta de la API:', response.data);
      dispatch(setLoading(false));
      setShowModal(true);

      setTimeout(() => {
        router.push('/admin');
      }, 2500);
    } catch (error) {
      console.error('Error al enviar datos a la API:', error);
      dispatch(setLoading(false));
      dispatch(setError(error.message));
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-start my-2 px-4 h-[90vh] overflow-y-auto">
      <h2 className="text-white text-4xl md:text-2xl font-semibold my-1">
        Edición de Clientes
      </h2>

      <form onSubmit={handleSubmit} className="w-full">
        {/* Sección Principales */}
        <div className="mb-8">
          <h3 className="text-white text-2xl font-semibold mb-4">
            Principales
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Nombre Completo"
              name="NombreCompleto"
              value={customerInfo.principales.NombreCompleto || ''}
              onChange={(e) =>
                handleChange('principales', 'NombreCompleto', e.target.value)
              }
              placeholder="Ingresa tu nombre completo"
            />
            <InputField
              label="Código del cliente"
              name="CodigoCliente"
              value={customerInfo.principales.CodigoCliente || ''}
              onChange={(e) =>
                handleChange('principales', 'CodigoCliente', e.target.value)
              }
              placeholder="Ingresa tu número de cliente"
            />
            {/* Agrega más campos de la sección Principales aquí */}
          </div>
        </div>

        {/* Sección Ubicación */}
        <div className="mb-8">
          <h3 className="text-white text-2xl font-semibold mb-4">Ubicación</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Localidad"
              name="localidad"
              value={customerInfo.ubicacion.localidad || ''}
              onChange={(e) =>
                handleChange('ubicacion', 'localidad', e.target.value)
              }
              placeholder="Ingresa tu localidad"
            />
            <InputField
              label="Calle"
              name="calle"
              value={customerInfo.ubicacion.calle || ''}
              onChange={(e) =>
                handleChange('ubicacion', 'calle', e.target.value)
              }
              placeholder="Ingresa tu calle"
            />
            {/* Agrega más campos de la sección Ubicación aquí */}
          </div>
        </div>

        {/* Sección Horus */}
        <div className="mb-8">
          <h3 className="text-white text-2xl font-semibold mb-4">Horus</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Horario de venta (Desde)"
              name="saleHorusFrom"
              type="time"
              value={customerInfo.horus.saleHorusFrom || ''}
              onChange={(e) =>
                handleChange('horus', 'saleHorusFrom', e.target.value)
              }
            />
            <InputField
              label="Horario de venta (Hasta)"
              name="saleHorusTo"
              type="time"
              value={customerInfo.horus.saleHorusTo || ''}
              onChange={(e) =>
                handleChange('horus', 'saleHorusTo', e.target.value)
              }
            />
            {/* Agrega más campos de la sección Horus aquí */}
          </div>
        </div>

        <div className="flex gap-5 flex-col sm:flex-row my-5">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="w-[15rem] h-12 bg-transparent border-principal border-2 rounded-xl text-principal text-lg tracking-wide font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-[15rem] h-12 bg-[#427EF3] rounded-xl text-white text-lg tracking-wide font-semibold"
          >
            Guardar cambios
          </button>
        </div>
      </form>

      {showModal && <CompleteModal setShowModal={setShowModal} />}
    </div>
  );
}

export default CustomerEdition;

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
}) => (
  <div className="flex flex-col w-full">
    <label htmlFor={name} className="text-sm font-semibold text-white">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="bg-[#E2E5E5] h-12 rounded-lg p-4 text-base w-full text-black"
    />
  </div>
);
