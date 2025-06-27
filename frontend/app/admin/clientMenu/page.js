import Table from './components/Table';
import Link from 'next/link';

function CustomerEdition() {
  return (
    <div className="">
      <div className="flex flex-col justify-center items-center ">
        <Table />
        <Link
          href="/admin/clientRegistration"
          className="p-1 text-blue-500 flex items-center my-5"
        >
          <img src="/svg/addNewUser.svg" className="h-20"></img>
          Agregar nuevo Cliente
        </Link>
      </div>
    </div>
  );
}

export default CustomerEdition;
