import DistribuidorTable from "./components/TableDistri";
import Link from 'next/link';

function DistribuidorMenu() {
  return (
    <div className="flex w-full min-w-0 flex-col pb-4">
      {/* Tabla de usuarios */}
      <DistribuidorTable />

      {/* Botón de agregar nuevo usuario */}
      <Link
        href="/admin/distributorRegistration"
        className="mac-press mx-auto mt-4 flex items-center rounded-2xl bg-white px-5 py-2.5 text-sm font-medium text-blue-600 shadow hover:shadow-md"
      >
        <img src="/svg/addNewUser.svg" className="h-10 mr-2" />
        <span>Agregar nuevo Distribuidor</span>
      </Link>
    </div>
  );
}

export default DistribuidorMenu;