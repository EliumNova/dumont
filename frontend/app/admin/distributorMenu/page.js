import DistribuidorTable from "./components/TableDistri";
import Link from 'next/link';

function DistribuidorMenu() {
  return (
    <div className="flex flex-col items-center">
      {/* Tabla de usuarios */}
      <DistribuidorTable />

      {/* Botón de agregar nuevo usuario */}
      <Link
        href="/admin/distributorRegistration"
        className="p-1 text-blue-500 flex items-center mt-4"
      >
        <img src="/svg/addNewUser.svg" className="h-10 mr-2" />
        <span>Agregar nuevo Distribuidor</span>
      </Link>
    </div>
  );
}

export default DistribuidorMenu;