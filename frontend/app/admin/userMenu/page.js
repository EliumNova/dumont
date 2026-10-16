import Table from './Componentes/Table';
import Link from 'next/link';

function UserMenu() {
  return (
    <div className="flex h-full flex-col items-center gap-5 overflow-y-auto px-4 py-6">
      <div className="w-full max-w-5xl">
        <Table />
      </div>

      <Link
        href="/admin/userRegistration"
        className="mac-press flex items-center gap-2 rounded-2xl bg-white/90 px-5 py-2.5 text-sm font-medium text-blue-600 shadow-lg backdrop-blur hover:bg-white">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">+</span>
        Agregar nuevo usuario
      </Link>
    </div>
  );
}

export default UserMenu;
