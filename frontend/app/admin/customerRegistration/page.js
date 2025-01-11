'use client';
import React, { useState } from 'react';
import Principales from './Componentes/Principales';
import Ubicacion from './Componentes/Ubicacion';
import Horus from './Componentes/Horus';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import CompleteModal from './Componentes/CompleteModal';
import { useRouter } from 'next/navigation';

function CustomerRegistration() {
  const newCustomerStore = useSelector((state) => state.newCustomer);
  const dispatch = useDispatch();
  const router = useRouter();
  // console.log('store newCustomerStore', newCustomerStore);

  const [progress, setProgress] = useState(33);
  const [inPrincipales, setInPrincipales] = useState(true);
  const [inUbication, setInUbication] = useState(false);
  const [inHorus, setInHorus] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Accediendo a la variable en tu código
  let URL = `http://localhost:4000/api/clientes/create`;

  let response = '';
  const handleSubmit = (e) => {
    if (inPrincipales) {
      setInUbication(true);
      setProgress(66);
      setInPrincipales(false);
    } else if (inUbication) {
      setInUbication(false);
      setInHorus(true);
      setProgress(100);
    } else if (inHorus) {
      e.preventDefault();
      console.log('store completa: ', newCustomerStore);
      response = axios.post(URL, newCustomerStore);
      console.log('reponse:', response);
      /**  setShowModal(true)
     setTimeout(() => {
      router.push("/admin/customerMenu");
    }, 2500); */
    }
    console.log('submit');
  };
  console.log('reponse out:', response);

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
    <main className="flex flex-col gap-4 md:justify-center items-center w-3/4 xl:p-12 p-3 m-auto flex-wrap">
      <h2 className="text-4xl md:text-5xl font-semibold">
        Registro de Clientes
      </h2>

      <div className="w-3/4 mx-auto">
        {inPrincipales && (
          <h3 className="text-3xl font-bold my-2">Datos Principales</h3>
        )}
        {inUbication && <h3 className="text-3xl font-bold my-2">Ubicación</h3>}
        {inHorus && <h3 className="text-3xl font-bold  my-2">Horarios</h3>}
        <div className="w-full bg-gray-300 h-2 rounded">
          <div
            className="h-full bg-black rounded"
            style={{
              width: `${progress}%`,
              transition: 'width 0.3s ease-in-out',
            }} // Ajusta el ancho dinámicamente
          />
        </div>
      </div>
      <form
        // onSubmit={handleSubmit}
        className=" flex items-center flex-col  w-full  "
      >
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
        {/* 
        <div className="flex flex-row gap-4 justify-center items-center p-4">
          <button
            onClick={handleBack}
            className="w-[15rem] h-14 relative top-11
          bg-transparent border-principal border-2 rounded-xl text-principal text-lg tracking-wide font-semibold"
          >
            {inPrincipales ? <> Cancelar</> : <>Atras</>}
          </button>
          <button
            // onClick={}
            className="w-[15rem] h-14 relative top-11
          bg-[#427EF3] rounded-xl text-white text-lg tracking-wide font-semibold"
          >
            {inHorus ? <>Registrar Cliente</> : <> Siguiente</>}
          </button>
        </div> */}
      </form>
      {showModal && (
        <>
          <CompleteModal setShowModal={setShowModal} />
        </>
      )}
    </main>
  );
}

export default CustomerRegistration;
