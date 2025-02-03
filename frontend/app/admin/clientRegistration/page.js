'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Principales from './Componentes/Principales';
import Ubicacion from './Componentes/Ubicacion';
import Horus from './Componentes/Horus';
import CompleteModal from './Componentes/CompleteModal';
import { setLoading, setError } from '@/lib/slices/newCustomerSlice';
import { createClient } from '@/lib/slices/clients/clientAction';

function CustomerRegistration() {
  const newCustomerStore = useSelector((state) => state.newCustomer);
  const dispatch = useDispatch();
  const router = useRouter();

  const [progress, setProgress] = useState(33);
  const [inPrincipales, setInPrincipales] = useState(true);
  const [inUbication, setInUbication] = useState(false);
  const [inHorus, setInHorus] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const URL = `http://localhost:3001/api/clientes/create`;

  useEffect(() => {
    console.log('Current Store Data:', newCustomerStore);
  }, [newCustomerStore]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inPrincipales) {
      setInUbication(true);
      setProgress(66);
      setInPrincipales(false);
    } else if (inUbication) {
      setInUbication(false);
      setInHorus(true);
      setProgress(100);
    } else if (inHorus) {
      try {
        dispatch(setLoading(true));
        console.log('Enviando solicitud a la API:', URL);
        console.log('Datos enviados:', newCustomerStore);
        const response = await axios.post(URL, newCustomerStore, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Respuesta de la API:', response.data);
        dispatch(createClient(response.data));
        dispatch(setLoading(false));
        setShowModal(true);
        setTimeout(() => {
          router.push('/admin/customerMenu');
        }, 2500);
      } catch (error) {
        console.error('Error al enviar datos a la API:', error);
        dispatch(setLoading(false));
        dispatch(setError(error.message));
      }
    }
  };

  const handleBack = () => {
    if (inPrincipales) {
      console.log('volver');
    } else if (inUbication) {
      setInUbication(false);
      setInPrincipales(true);
      setProgress(33);
    } else if (inHorus) {
      setInHorus(false);
      setInUbication(true);
      setProgress(66);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center my-5 px-2">
      <h2 className="text-white text-3xl md:text-5xl font-semibold my-2">
        Registro de Clientes
      </h2>
      <div className="w-full bg-gray-300 h-2 rounded mb-4">
        <div
          className="h-full bg-black rounded"
          style={{
            width: `${progress}%`,
            transition: 'width 0.3s ease-in-out',
          }}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full lg:w-8/12 xl:w-9/12 my-1 px-4 text-white"
      >
        <div className="container mx-auto grid grid-cols-1 gap-4 w-full justify-items-center xl:items-center">
          {inPrincipales && (
            <Principales
              setInUbication={setInUbication}
              setProgress={setProgress}
              setInPrincipales={setInPrincipales}
            />
          )}
          {inUbication && (
            <Ubicacion
              setInUbication={setInUbication}
              setProgress={setProgress}
              setInHorus={setInHorus}
              setInPrincipales={setInPrincipales}
            />
          )}
          {inHorus && (
            <Horus
              setInUbication={setInUbication}
              setProgress={setProgress}
              setInHorus={setInHorus}
              setShowModal={setShowModal}
            />
          )}
        </div>
        {showModal && <CompleteModal setShowModal={setShowModal} />}
      </form>
    </div>
  );
}

export default CustomerRegistration;
