'use client';
import { useState } from 'react';
import DevicesTable from './components/DevicesTable';
import NewDevice from './components/NewDevice';
import ModalWindow from '../components/ModalWindow';
import Image from 'next/image';

function DispositivosMenu() {
  const [showNewDeviceForm, setShowNewDeviceForm] = useState(false); // Para manejar el formulario
  const [mostrarModal, setMostrarModal] = useState(false);
  const [showAllDevices, setShowAllDevices] = useState(true); // Para manejar la tabla de dispositivos
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

  // Callback que el hijo (Formulario) llamará
  const manejarFormularioEnviado = () => {
    setShowNewDeviceForm(false); // Ocultar formulario
    setShowAllDevices(true); // Mostrar la tabla
    setMostrarModal(true); // Mostrar modal

    setTimeout(() => {
      setMostrarModal(false);
    }, 5000);
  };

  const handleAddNewDeviceClick = () => {
    setShowNewDeviceForm(true);
    setShowAllDevices(false); // Ocultar la tabla de dispositivos cuando se muestra el formulario
  };

  return (
    <div className="">
      <div className="flex flex-col justify-center items-center w-full">
        {showAllDevices && <DevicesTable devices={devices} />}{' '}
        {/* Mostrar la tabla solo si showAllDevices es verdadero */}
        <button
          className="p-1 text-blue-500 flex items-center my-5"
          onClick={handleAddNewDeviceClick}
        >
          <img
            src="/svg/addNewUser.svg"
            className="h-20"
            alt="Agregar nuevo dispositivo"
          />
          Agregar nuevo dispositivo
        </button>
      </div>

      {showNewDeviceForm && (
        <NewDevice onFormularioEnviado={manejarFormularioEnviado} />
      )}
      {mostrarModal && (
        <ModalWindow text={'¡Dispositivo registrado con éxito!'} />
      )}
    </div>
  );
}

export default DispositivosMenu;
