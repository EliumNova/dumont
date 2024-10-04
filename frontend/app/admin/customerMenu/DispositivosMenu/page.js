'use client';
import { useState } from 'react';
import DevicesTable from './components/DevicesTable';
import NewDevice from './components/NewDevice';
import ModalWindow from '../../components/ModalWindow';
import Image from 'next/image';

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

  return (
    <div className="container mx-auto py-10">
      <div className="flex gap-5 items-center my-5">
        <Image
          width={100}
          height={100}
          src={'/UserIcon1.jpeg'}
          alt="DuMont Logo"
          className="rounded-full w-15 md:w-20 transition-all duration-150"
        />
        <h2 className="text-2xl">Jacob Jones</h2>
      </div>

      {newDevice && (
        <NewDevice onFormularioEnviado={manejarFormularioEnviado} />
      )}
      {mostrarModal && (
        <ModalWindow text={'¡Dispositivo registrado con èxito!'} />
      )}
      {/* NO MOSTRAR SI EL ClIENTE NO TIENE DISPOSITIVOS */}
      {/* {devices && <DevicesTable devices={devices}></DevicesTable>} */}
      {/* <button
        href="/admin/userRegistration"
        onClick={() => {
          setNewDevice(true), setDevices(false);
        }}
        className="p-1 text-blue-500 flex items-center text-xl"
      >
        <img src="/svg/addNewUser.svg" className="h-20"></img>
        Agregar nuevo dispositivo
      </button> */}
    </div>
  );
}

export default DispositivosMenu;
