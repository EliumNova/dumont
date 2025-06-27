import Table from './Componentes/Table';
import Link from 'next/link';

function UserMenu() {
  return (
    <div className="flex flex-col items-center">
      {/* Tabla de usuarios */}
      <Table />

      {/* Botón de agregar nuevo usuario */}
      <Link
        href="/admin/userRegistration"
        className="p-1 text-blue-500 flex items-center mt-4"
      >
        <img src="/svg/addNewUser.svg" className="h-10 mr-2" />
        <span>Agregar nuevo usuario</span>
      </Link>
    </div>
  );
}

export default UserMenu;
