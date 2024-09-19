import Table from './Componentes/Table';
import EditUserBtn from './Componentes/EditUserBtn';

function CustomerMenu() {
  return (
    <div className="">
      <h3 className="text-3xl font-bold ">Jacob Jall</h3>

      <div className="flex flex-col justify-center items-center ">
        <Table />

        <EditUserBtn />
      </div>
    </div>
  );
}

export default CustomerMenu;
