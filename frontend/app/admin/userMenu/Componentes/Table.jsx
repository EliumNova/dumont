'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '@/lib/slices/users/userAction';
import EditUserBtn from './EditUserBtn';

function Table() {
  const dispatch = useDispatch();
  // const [user, setUsers] = useState([
  //   {
  //     name: 'Esther Howard',
  //     email: 'esther.howard@example',
  //     dni: '40146000',
  //     rolAdmin: 'Si',
  //   },
  //   {
  //     name: 'Dianne Russell',
  //     email: 'dianne.russell@example',
  //     dni: '36598216',
  //     rolAdmin: 'No',
  //   },
  //   {
  //     name: 'Arlene McCoy Howard',
  //     email: 'arlene.mccoy@example',
  //     dni: '21904294',
  //     rolAdmin: 'Si',
  //   },
  //   {
  //     name: 'Ronald Ricards',
  //     email: 'ronald.richards@example',
  //     dni: '31412046',
  //     rolAdmin: 'Si',
  //   },
  //   {
  //     name: 'Esther Howard',
  //     email: 'esther.howard@example',
  //     dni: '40146000',
  //     rolAdmin: 'No',
  //   },
  // ]);
  const users = useSelector((state) => state.users.allUsers);
  const userLogueado = useSelector((state) => state.auth.user);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch, refresh]);

  const forceRender = () => {
    setRefresh(!refresh);
  };
  console.log(refresh);
  console.log(userLogueado);

  const filterUsers = users.filter((e) => e.idUsuarios !== userLogueado.id); //sacamos el usuario logueado
  console.log(filterUsers);

  console.log('aca tienen que estar todos los usuarios', users);

  return (
    <div className="flex flex-col border border-[#12141D] rounded bg-[#12141D] text-center">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr className="text-white">
                  <th scope="col" className="px-6 py-3">
                    Nombre completo
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Correo Electronico
                  </th>
                  <th scope="col" className="px-6 py-3">
                    DNI
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Rol Administrador
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filterUsers &&
                  filterUsers.map((user, index) => (
                    <tr
                      className="border-b transition duration-300 ease-in-out text-white hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                      key={index}
                    >
                      <td className="whitespace-nowrap px-10 py-6 font-medium">
                        {user.Name}
                      </td>
                      <td className="whitespace-nowrap px-10 py-1">
                        {user.Email}
                      </td>
                      <td className="whitespace-nowrap px-10 py-1">
                        {user.DNI}
                      </td>
                      <td className="whitespace-nowrap px-10 py-1">
                        {!user.isAdmin ? 'No' : 'Si'}
                      </td>
                      <td className="whitespace-nowrap px-10 py-1">
                        {user.icon}
                        {
                          <EditUserBtn
                            datos={user}
                            onCloseModal={forceRender}
                          />
                        }
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;
