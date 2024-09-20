import Table from './Componentes/Table';
import EditUserBtn from './Componentes/EditUserBtn';
import Link from 'next/link';

function CustomerMenu() {
  return (
    <div className="">
      <h3 className="text-3xl font-bold text-center">Jacob Jall</h3>

      <div className="flex flex-col justify-center items-center ">
        <Table />
        <Link
          href="/admin/userRegistration"
          className="p-1 text-blue-500 flex items-center my-10"
        >
          <img src="/svg/addNewUser.svg" className="h-20"></img>
          Agregar nuevo usuario
        </Link>
      </div>
    </div>
  );
}

export default CustomerMenu;
