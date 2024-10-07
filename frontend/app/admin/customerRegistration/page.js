"use client";
import React, { useState } from "react";
<<<<<<< HEAD

function CustomerRegistration() {
  const[inPrincipales, setInPrincipales] = useState(true)

  const[inUbication, setInUbication] = useState(false)
  const[inHorus, setInHorus] = useState(false);

  const handleSubmit = () => {
    if(inPrincipales) {
      setInUbication(true)
      setInPrincipales(false)
    }
    else if(inUbication) {
      setInUbication(false)
      setInHorus(true)
    }

    console.log("submit");
  };
  return (
    <div className="flex flex-col gap-4 md:justify-center items-start h-[100%] w-3/4 p-12 m-auto flex-wrap ">
      <div className="left-0 md:left-[9.5rem] relative flex flex-col gap-2 ">
        <h2 className="text-3xl md:text-5xl font-semibold ">
          Registro de Clientes
        </h2>
        {inPrincipales && <h3 className="">Datos Principales</h3>}
        {inUbication && <h3 className="">Ubicación</h3>}
        {inHorus && <h3 className="">Horarios</h3>}
=======
import Principales from "./Componentes/Principales";
import Ubicacion from "./Componentes/Ubicacion";
import Horus from "./Componentes/Horus";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import CompleteModal from "./Componentes/CompleteModal";
import { useRouter } from "next/navigation";

function CustomerRegistration() {
  const newCustomerStore = useSelector((state) => state.newCustomer);
  const dispatch = useDispatch();
  const router = useRouter();
  console.log("store newCustomerStore", newCustomerStore);
  const [progress, setProgress] = useState(33);
  const [inPrincipales, setInPrincipales] = useState(true);

  const [inUbication, setInUbication] = useState(false);
  const [inHorus, setInHorus] = useState(false);
  const [showModal, setShowModal] = useState(false);

// Accediendo a la variable en tu código
let URL = `http://localhost:4000/api/clientes/create`;

  let response = ""
  const handleSubmit = (e) => {
    if (inPrincipales) {
      setInUbication(true);
      setProgress(66);
      setInPrincipales(false);
    } else if (inUbication) {
      setInUbication(false);
      setInHorus(true);
      setProgress(100);
    }else if (inHorus){
      e.preventDefault();
     console.log('store completa: ',newCustomerStore)
     response = axios.post(URL, newCustomerStore)
     console.log('reponse:',response)
   /**  setShowModal(true)
     setTimeout(() => {
      router.push("/admin/customerMenu");
    }, 2500); */
    }
    console.log("submit");
  };
  console.log('reponse out:',response)

  const handleBack = () => {
    if (inPrincipales) {
      console.log("volver");
    } else if (inUbication) {
      setInUbication(false);
      setInPrincipales(true);
      setProgress(33);
    } else if (inHorus) {
      setInHorus(false);
      setInUbication(true);
      setProgress(66);
    }
  };
  return (
    <div className="flex flex-col gap-4 md:justify-center items-start h-[100%] w-3/4 p-12 m-auto flex-wrap ">
      <div className="left-0 md:left-[9.5rem] relative flex flex-col gap-6 ">
        <h2 className="text-3xl md:text-5xl font-semibold ">
          Registro de Clientes
        </h2>
      </div>
      <div className=" w-3/4 mx-auto">
        {inPrincipales && (
          <h3 className="text-3xl font-bold my-2">Datos Principales</h3>
        )}
        {inUbication && <h3 className="text-3xl font-bold my-2">Ubicación</h3>}
        {inHorus && <h3 className="text-3xl font-bold  my-2">Horarios</h3>}
        <div className="w-full bg-gray-300 h-2 rounded">
          <div
            className="h-full bg-black rounded"
            style={{
              width: `${progress}%`,
              transition: "width 0.3s ease-in-out",
            }} // Ajusta el ancho dinámicamente
          />
        </div>
>>>>>>> main
      </div>
      <form
        onSubmit={handleSubmit}
        className=" flex items-center flex-col  w-full  "
      >
<<<<<<< HEAD
        {inPrincipales && <div
          className="w-4/5 h-auto flex flex-row gap-x-8 flex-wrap justify-start items-center 
     "
        >
          {/**código del cliente */}
          <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
            <label htmlFor="email" className="text-sm font-semibold">
              Código del client
            </label>
            <input
              type="text"
              id="name"
              placeholder="Ingresa tu numero de cliente"
              required
              className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
            />
          </div>

          {/**Segmentacion */}
          <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
            <label htmlFor="email" className="text-sm font-semibold">
              Segmentación
            </label>
            <select
              id="admin"
              className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
              required
            >
              <option value="kiosco">Kiosco</option>
              <option value="no">No</option>
            </select>
          </div>
          {/**código del distribuidor */}
          <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
            <label htmlFor="email" className="text-sm font-semibold">
              Código del distribuidor
            </label>
            <input
              type="text"
              id="name"
              placeholder="Ingresa tu numero de cliente"
              required
              className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
            />
          </div>
          {/**Correo electrónico */}
          <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
            <label htmlFor="email" className="text-sm font-semibold">
              Correo electrónico
            </label>
            <input
              type="email"
              id="name"
              placeholder="Ingresa tu correo electrónico"
              required
              className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
            />
          </div>
          {/**Pagina web */}
          <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
            <label htmlFor="email" className="text-sm font-semibold">
              Página Web
            </label>
            <input
              type="text"
              id="name"
              placeholder="Ingresa tu página web"
              required
              className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
            />
          </div>
          {/**Permiso de venta de alcohol*/}
          <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
            <label htmlFor="email" className="text-sm font-semibold">
              Permiso Venta Alchohol
            </label>
            <select
              id="admin"
              className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
              required
            >
              <option value="si">Si</option>
              <option value="no">No</option>
            </select>
          </div>
          {/**Teléfono */}
          <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
            <label htmlFor="email" className="text-sm font-semibold">
              Teléfono
            </label>
            <input
              type="number"
              id="name"
              placeholder="Ingresa tu numero de  teléfono"
              required
              className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
            />
          </div>
        </div>}
        {inUbication && <div
          className="w-4/5 h-auto flex flex-row gap-x-8 flex-wrap justify-start items-center "
        >
          {/**Localidad */}
          <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
            <label htmlFor="email" className="text-sm font-semibold">
              Localidad
            </label>
            <input
              type="text"
              id="name"
              placeholder="Ingresa tu Localidad"
              required
              className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
            />
          </div>

          {/**Calle */}
          <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
            <label htmlFor="email" className="text-sm font-semibold">
              Calle
            </label>
            <input
              type="text"
              id="name"
              placeholder="Ingresa tu Calle"
              required
              className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
            />
          </div>
          {/**Altura */}
          <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
            <label  className="text-sm font-semibold">
              Altura
            </label>
            <input
              type="text"
              id="name"
              placeholder="Ingresa tu Altura"
              required
              className=" bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
            />
          </div>
          {/**   Entre Calles */}
          <div className=" flex flex-col gap-3 w-[32rem] p-4 my-2">
            <label htmlFor="email" className="text-sm font-semibold">
              Entre Calles
            </label>
           <div className="flex flex-row  items-center gap-2">
           <input
              type="text"
              id="name"
              placeholder="Calle 1"
              required
              className=" w-1/2 bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
            />
            Y 
             <input
              type="text"
              id="name"
              placeholder="Calle 2"
              required
              className=" w-1/2 bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
            />
           </div>
          </div>
       
        </div>}
        

        <div className="flex flex-row gap-4 justify-center items-center p-4">
          <button
            className="w-[15rem] h-14 relative top-11
          bg-transparent border-principal border-2 rounded-xl text-principal text-lg tracking-wide font-semibold"
          >
            Cancelar
          </button>
          <button
          onClick={handleSubmit}
            className="w-[15rem] h-14 relative top-11
          bg-[#427EF3] rounded-xl text-white text-lg tracking-wide font-semibold"
          >
            Siguiente
          </button>
        </div>
      </form>
=======
        {inPrincipales && <Principales />}
        {inUbication && <Ubicacion />}
        {inHorus && <Horus />}

        <div className="flex flex-row gap-4 justify-center items-center p-4">
          <button
            onClick={handleBack}
            className="w-[15rem] h-14 relative top-11
          bg-transparent border-principal border-2 rounded-xl text-principal text-lg tracking-wide font-semibold"
          >
            {inPrincipales ? <> Cancelar</> : <>Atras</>}
          </button>
          <button
            onClick={handleSubmit}
            className="w-[15rem] h-14 relative top-11
          bg-[#427EF3] rounded-xl text-white text-lg tracking-wide font-semibold"
          >
            {inHorus ? <>Registrar Cliente</> : <> Siguiente</>}
          </button>
        </div>
      </form>
       {showModal && (
        <>
          <CompleteModal
            setShowModal={setShowModal}
          />
        </>
      )}

>>>>>>> main
    </div>
  );
}

export default CustomerRegistration;
