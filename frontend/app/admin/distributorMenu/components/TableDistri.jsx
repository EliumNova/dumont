'use client';

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDistribuidores } from "@/lib/slices/distribuidores/distribuidorAction";
import EditDistBtn from "./EditDistBtn";
export default function DistribuidorTable(){
    const dispatch = useDispatch();
    const distribuidores = useSelector((state) => state.distribuidores.allDistribuidores);
    const [refresh, setRefresh] = useState(false);
    
    useEffect(() => {
        dispatch(getDistribuidores());
    }, [dispatch, refresh]);

    const forceRender = () => {
        setRefresh(!refresh);
      };
    console.log(distribuidores);
    
    
      return (
        <div className="flex flex-col border border-[#12141D] rounded bg-[#12141D] text-center">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr className="text-white">
                      <th scope="col" className="px-6 py-3">
                        Nombre Comercial
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Razon Social
                      </th>
                      <th scope="col" className="px-6 py-3">
                        CUIT
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Telefono
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {distribuidores.rows &&
                      distribuidores.rows.map((dist, index) => (
                        <tr
                          className="border-b transition duration-300 ease-in-out text-white hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                          key={index}
                        >
                          <td className="whitespace-nowrap px-10 py-6 font-medium">
                            {dist.NombreComercial}
                          </td>
                          <td className="whitespace-nowrap px-10 py-1">
                            {dist.RazonSocial}
                          </td>
                          <td className="whitespace-nowrap px-10 py-1">
                            {dist.CUIT}
                          </td>
                          <td className="whitespace-nowrap px-10 py-1">
                            {dist.Telefono}
                          </td>
                          <td className="whitespace-nowrap px-10 py-1">
                            {
                              <EditDistBtn
                                datos={dist}
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
