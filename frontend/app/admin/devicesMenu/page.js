import DevicesTable from './components/DevicesTable'; // Asegúrate de que este componente esté correctamente importado
import Link from 'next/link';

function DispositivosMenu() {
  return (
    <div className="flex w-full min-w-0 flex-col pb-4">
      {/* Tabla de dispositivos */}
      <DevicesTable />

      {/* Botón de agregar nuevo dispositivo */}
      <Link
        href="/admin/devicesRegistration"
        className="mac-press mx-auto mt-4 flex items-center rounded-2xl bg-white px-5 py-2.5 text-sm font-medium text-blue-600 shadow hover:shadow-md"
      >
        <img src="/svg/addNewUser.svg" className="h-10 mr-2" />
        <span>Agregar nuevo Dispositivo</span>
      </Link>
    </div>
  );
}

export default DispositivosMenu;
