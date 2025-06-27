import DevicesTable from './components/DevicesTable'; // Asegúrate de que este componente esté correctamente importado
import Link from 'next/link';

function DispositivosMenu() {
  return (
    <div className="flex flex-col items-center">
      {/* Tabla de dispositivos */}
      <DevicesTable />

      {/* Botón de agregar nuevo dispositivo */}
      <Link
        href="/admin/devicesRegistration"
        className="p-1 text-blue-500 flex items-center mt-4"
      >
        <img src="/svg/addNewUser.svg" className="h-10 mr-2" />
        <span>Agregar nuevo Dispositivo</span>
      </Link>
    </div>
  );
}

export default DispositivosMenu;
