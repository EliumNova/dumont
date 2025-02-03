import Table from './components/Table';
import EditUserBtn from './components/EditUserBtn';
import Link from 'next/link';

function CustomerMenu() {
  return (
    <div className="">
      <div className="flex flex-col justify-center items-center ">
        <Table />
        <Link
          href="/admin/clientRegistration"
          className="p-1 text-blue-500 flex items-center my-5"
        >
          <img src="/svg/addNewUser.svg" className="h-20"></img>
          Agregar nuevo cliente
        </Link>
      </div>
    </div>
  );
}

export default CustomerMenu;
