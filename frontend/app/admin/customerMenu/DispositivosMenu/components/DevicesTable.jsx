import Image from 'next/image';
import Link from 'next/link';

export default function DevicesTable({ devices }) {
  return (
    <div className="grid items-center gap-5">
      <div className="flex gap-5 items-center">
        <Image
          width={100}
          height={100}
          src={'/UserIcon1.jpeg'}
          alt="DuMont Logo"
          className="rounded-full w-15 md:w-20 transition-all duration-150"
        />
        <h2 className="text-2xl">Jacob Jones</h2>
      </div>

      <div className="rounded-xl overflow-hidden border border-black border-slate-400">
        <table className="min-w-full border-collapse">
          <thead className="font-medium text-gray-600">
            <tr>
              <th scope="col" className="px-10 py-6 text-center ">
                Número de serie
              </th>
              <th scope="col" className="px-10 py-6 text-center ">
                Marca
              </th>
              <th scope="col" className="px-10 py-6 text-center ">
                Modelo
              </th>
              <th scope="col" className="px-10 py-6 text-center ">
                Pulgadas
              </th>
              <th scope="col" className="px-10 py-6 text-center ">
                Estado
              </th>
              <th scope="col" className="px-10 py-6 text-center ">
                Localización a tiempo real
              </th>
              <th scope="col" className="px-10 py-6 text-center ">
                Editar
              </th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device, index) => (
              <tr
                key={index}
                className="border-t border-slate-400 text-gray-600 font-light"
              >
                <td className="whitespace-nowrap px-10 py-6 text-center">
                  {device.numSerie}
                </td>
                <td className="whitespace-nowrap px-10 py-6 text-center">
                  {device.marca}
                </td>
                <td className="whitespace-nowrap px-10 py-6 text-center">
                  {device.modelo}
                </td>
                <td className="whitespace-nowrap px-10 py-6 text-center">
                  {device.pulgadas}
                </td>
                <td className="whitespace-nowrap px-10 py-6 text-center flex justify-center gap-2 items-center">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      device.estado === 'true' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></div>
                  {device.estado === 'true' ? 'En línea' : 'Desconectado'}
                </td>
                <td className="whitespace-nowrap px-10 py-6 text-center">
                  {device.ubicacion}
                </td>
                <td className="whitespace-nowrap px-10 py-6 text-center">
                  <Image
                    src="/svg/deviceIcon.svg"
                    width={30}
                    height={30}
                    priority
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link
        href="/admin/userRegistration"
        className="p-1 text-blue-500 flex items-center text-xl"
      >
        <imhhg src="/svg/addNewUser.svg" className="h-20"></imhhg>
        Agregar nuevo dispositivo
      </Link>
    </div>
  );
}
