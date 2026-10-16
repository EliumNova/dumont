import Table from './components/Table';
import Link from 'next/link';

function CustomerEdition() {
  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col pb-4">
        <Table />
        <Link
          href="/admin/clientRegistration"
          className="mac-press mx-auto mt-4 flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-medium text-blue-600 shadow hover:shadow-md"
        >
          <img src="/svg/addNewUser.svg" alt="" className="h-8" />
          Agregar nuevo Cliente
        </Link>
      </div>
    </div>
  );
}

export default CustomerEdition;
