"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  distribuidorUpdate,
  distribuidorDelete,
} from "@/lib/slices/distribuidores/distribuidorAction";
import InputField from "../../components/InputField";
import { AiOutlineEdit } from "react-icons/ai";

function EditDistBtn({ datos, onEditComplete }) {
  const dispatch = useDispatch();
  //const router = useRouter();
  //const {id} = router.query

  const [editDist, setEditDist] = useState(false);
  const [distDelete, setDistDelete] = useState(false);
  const [distSave, setDistSave] = useState(false);
  const [registerDist, setRegisterDist] = useState({
    Calle: "",
    SegundoTelefono: "",
    Email: "",
    EntreCalles: "",
    Localidad: "",
    NombreComercial: "",
    RazonSocial: "",
    Telefono: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  // Maneja la apertura del modal y el llenado de datos
  const handleModalOpen = () => {
    setRegisterDist({
      Calle: datos.Calle || "",
      SegundoTelefono: datos.SegundoTelefono || "",
      Email: datos.Email || "",
      EntreCalles: datos.EntreCalles || "",
      Localidad: datos.Localidad || "",
      NombreComercial: datos.NombreComercial || "",
      RazonSocial: datos.RazonSocial || "",
      Telefono: datos.Telefono || "",
    });
    setEditDist(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const processedValue = name === "admin" ? value === "true" : value;

    const validations = {
      //CUIT: /^[0-9]{10}$/,
      NombreComercial: /^[a-zA-Z\s]*$/,
      Email: /^[a-zA-Z@.\s]*$/,
    };

    if (name in validations) {
      if (value === "" || validateInput(processedValue, validations[name])) {
        registrar(name, processedValue);
      } else {
        errorMessageBox();
      }
    } else {
      registrar(name, processedValue);
    }
  };

  const validateInput = (value, regex) => regex.test(value);

  const registrar = (name, processedValue) => {

    return setRegisterDist((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const errorMessageBox = () => {
    setErrorMessage("Caracteres inválidos en el campo.");
    setTimeout(() => setErrorMessage(""), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //Validar los campos
    const {
      Calle,
      SegundoTelefono,
      Email,
      EntreCalles,
      Localidad,
      NombreComercial,
      RazonSocial,
      Telefono,
    } = registerDist;
    if (
      !Calle ||
      !SegundoTelefono ||
      !Email ||
      !EntreCalles ||
      !Localidad ||
      !NombreComercial ||
      !RazonSocial ||
      !Telefono
    ) {
      setErrorMessage("Todos los campos son obligatorios");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    dispatch(distribuidorUpdate(datos.idDistribuidor, registerDist));
    handleCloseModal();
  };

  const handleDelete = () => {
    setDistDelete(!distDelete);
    setEditDist(!editDist);

    dispatch(distribuidorDelete(datos.idDistribuidor));
    onCloseModal();
  };

  const handleCloseModal = () => {
    setTimeout(() => {
      setEditDist(false);
      onEditComplete?.(); // 🔥 vuelve a pedir la tabla
    }, 300);
  };

  return (
    <div className="flex p-1 gap-5">
      <button
        onClick={handleModalOpen}
        className=" flex items-center justify-center text-2xl">
        <AiOutlineEdit />
      </button>
      {editDist && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40 p-2 lg:p-10">
          <div className="relative flex flex-col bg-white p-8 rounded-lg shadow-lg xl:w-[600px] w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-4xl font-semibold mb-7 text-black">
              Editar Distribuidor
            </h2>

            <InputField
              label="Nombre Comercial"
              id="NombreComercial"
              name="NombreComercial"
              value={registerDist.NombreComercial}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0 text-black"
              labelClassName="font-light "
              inputClassName="rounded-2xl text-black"
            />
            <InputField
              label="Razon Social"
              id="RazonSocial"
              name="RazonSocial"
              value={registerDist.RazonSocial}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0 text-black"
              labelClassName="font-light"
              inputClassName="rounded-2xl text-black"
            />
            <InputField
              label="Calle"
              id="Calle"
              name="Calle"
              value={registerDist.Calle}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0 text-black"
              labelClassName="font-light"
              inputClassName="rounded-2xl text-black"
            />
            <InputField
              label="EntreCalles"
              id="EntreCalles"
              name="EntreCalles"
              value={registerDist.EntreCalles}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0 text-black"
              labelClassName="font-light"
              inputClassName="rounded-2xl text-black"
            />
            <InputField
              label="Localidad"
              id="Localidad"
              name="Localidad"
              value={registerDist.Localidad}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0 text-black"
              labelClassName="font-light"
              inputClassName="rounded-2xl text-black"
            />
            <InputField
              label="Email"
              id="Email"
              name="Email"
              type="email"
              placeholder="distribuidor@email.com"
              value={registerDist.Email}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0 text-black"
              labelClassName="font-light"
              inputClassName="rounded-2xl text-black"
            />
            <InputField
              label="Telefono"
              id="Telefono"
              name="Telefono"
              value={registerDist.Telefono}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0 text-black"
              labelClassName="font-light"
              inputClassName="rounded-2xl text-black"
            />
            <InputField
              label="SegundoTelefono"
              id="Contacto"
              name="SegundoTelefono"
              value={registerDist.SegundoTelefono}
              onChange={handleChange}
              required
              className="gap-3 font-light p-0 text-black"
              labelClassName="font-light"
              inputClassName="rounded-2xl text-black"
            />

            <div className="flex gap-10 flex-col lg:flex-row my-4">
              <button
                onClick={() => setDistSave(!distSave)}
                className="xl:w-6/12 text-blue-500 py-4 px-6 rounded-2xl text-xl border-solid border-2 border-blue-500 font-semibold">
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 font-semibold xl:w-6/12 text-white py-4 px-6 rounded-2xl text-xl">
                Guardar
              </button>
            </div>
            <button
              onClick={() => setDistDelete(!distDelete)}
              className="w-full font-semibold text-red-500 py-4 px-6 rounded-2xl text-xl border-solid border-2 border-red-500 flex justify-center gap-5 hover:bg-red-300">
              <img src="/svg/trashIcon.svg" alt="Eliminar" />
              Eliminar Distribuidor
            </button>
          </div>
        </div>
      )}

      {distDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-10">
          <div className="bg-white h-96 w-96 rounded-3xl flex flex-col place-items-center justify-center gap-10 ">
            <img src="/svg/alertIcon.svg" alt="" />
            <p className="">
              ¿Estas seguro que deseas eliminar este Distribuidor?
            </p>
            <div className="flex gap-5 flex-col lg:flex-row">
              <button
                onClick={() => setDistDelete(!distDelete)}
                className="xl:w-6/12 text-blue-500 py-4 px-6 rounded-2xl text-xl border-solid border-2 border-blue-500 font-semibold">
                Cancelar
              </button>
              <button
                onClick={
                  handleDelete
                  //   () => {
                  //   setDistDelete(!distDelete);
                  //   setEditDist(!distUser);
                  // }
                }
                className="bg-red-500 font-semibold xl:w-6/12 text-white py-4 px-6 rounded-2xl text-xl">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {distSave && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-10">
          <div className="bg-white h-96 w-96 rounded-3xl flex flex-col place-items-center justify-center gap-10 ">
            <img src="/svg/alertIcon.svg" alt="" />
            <p className="text-lg text-black">
              ¿Deseas descartar la edición del Distribuidor?
            </p>
            <div className="flex gap-5 flex-col lg:flex-row">
              <button
                onClick={() => {
                  setDistSave(!distSave);
                  handleCloseModal();
                }}
                className="xl:w-6/12 text-blue-500 py-4 px-6 rounded-2xl text-xl border-solid border-2 border-blue-500 font-semibold">
                Cancelar
              </button>
              <button
                onClick={() => {
                  setDistSave(!distSave);
                  setEditDist(!editDist);
                }}
                className="bg-red-500 font-semibold xl:w-6/12 text-white py-4 px-6 rounded-2xl text-xl">
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditDistBtn;
