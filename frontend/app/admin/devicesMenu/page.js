'use client';
import { useState } from 'react';
import DevicesTable from './components/DevicesTable';
import NewDevice from './components/NewDevice';
import ModalWindow from '../components/ModalWindow';
import Image from 'next/image';
import { Table } from './components/Table';
import Link from 'next/link';

function DispositivosMenu() {
  const [newDevice, setNewDevice] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  // Callback que el hijo (Formulario) llamará
  const manejarFormularioEnviado = () => {
    setNewDevice(false); // Ocultar formulario
    setMostrarModal(true); // Mostrar modal

    setTimeout(() => {
      setMostrarModal(false);
    }, 5000);
  };

  const [devices, setDevices] = useState([
    {
      numSerie: 'F4JM3NOOLPP3',
      marca: 'Apple',
      modelo: '11 PRO Max',
      pulgadas: '6,6',
      estado: 'true',
      ubicacion: 'Si',
    },
    {
      numSerie: '8MKJ6UIPL5VC',
      marca: 'Samsung',
      modelo: '11 PRO Max',
      pulgadas: 'Galaxy A23',
      estado: 'false',
      ubicacion: 'No',
    },
    {
      numSerie: '3519J2MSK2KO',
      marca: 'Samsung',
      modelo: 'Galaxy A05',
      pulgadas: '6,6H',
      estado: 'false',
      ubicacion: 'Si',
    },
    {
      numSerie: '823ANDK2NKDL',
      marca: 'Samsung',
      modelo: 'Galaxt A05',
      pulgadas: '6,7',
      estado: 'true',
      ubicacion: 'Si',
    },
  ]);
  const [showAllDevices, setShowAllDevices] = useState(false);

  return (
    <div className="">
      <div className="flex flex-col justify-center items-center w-full">
        <Table />
        <Link
          href="/admin/userRegistration"
          className="p-1 text-blue-500 flex items-center my-5"
        >
          <img src="/svg/addNewUser.svg" className="h-20"></img>
          Agregar nuevo dispositivo
        </Link>
      </div>

      {newDevice && (
        <NewDevice
          onFormularioEnviado={manejarFormularioEnviado}
          showAllDevices={() => setShowAllDevices(true)}
        />
      )}
      {mostrarModal && (
        <ModalWindow text={'¡Dispositivo registrado con èxito!'} />
      )}
      {/* NO MOSTRAR SI EL ClIENTE NO TIENE DISPOSITIVOS */}
      {showAllDevices && <DevicesTable devices={devices}></DevicesTable>}
      <button
        href="/admin/userRegistration"
        onClick={() => {
          setNewDevice(true), setDevices(false);
        }}
        className="p-1 text-blue-500 flex items-center text-xl"
      >
        <img src="/svg/addNewUser.svg" className="h-20"></img>
        Agregar nuevo dispositivo
      </button>
    </div>
  );
}

export default DispositivosMenu;
