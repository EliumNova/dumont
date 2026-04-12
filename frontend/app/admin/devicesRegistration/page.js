"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import SelectField from "./Componentes/SelectedField";
import InputField from "./Componentes/InputField";
import ModalWindow from "./Componentes/ModalWindow";
import { dispositivoCreate } from "@/lib/slices/dispositivos/dispositivoAction";

function DispositivoRegistration() {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [dispositivo, setDispositivo] = useState({
    CodigoDumont: "",
    idClientes: "",
    Marca: "",
    Modelo: "",
    NumSerie: "",
  });
  const [modal, setModal] = useState(false);
  const [distribuidores, setDistribuidores] = useState([]);
  const [clientes, setClientes] = useState([]);

  // Obtener distribuidores y clientes al cargar el componente
  useEffect(() => {
    const fetchDistribuidores = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/distribuidores/`,
        );
        if (!response.ok) {
          throw new Error("Error al obtener los distribuidores");
        }
        const data = await response.json();
        const transformedData = data.rows.map((distribuidor) => ({
          value: distribuidor.CodigoDistribuidor.toString(),
          label: `${distribuidor.CodigoDistribuidor} - ${distribuidor.NombreComercial}`,
        }));
        setDistribuidores(transformedData);
      } catch (error) {
        console.error("Error al obtener los distribuidores:", error);
      }
    };

    const fetchClientes = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/clientes/`,
        );
        if (!response.ok) {
          throw new Error("Error al obtener los clientes");
        }
        const data = await response.json();
        const transformedData = data.rows.map((cliente) => ({
          value: cliente.idClientes.toString(),
          label: `${cliente.CodigoCliente} - ${cliente.NombreCompleto}`,
        }));
        setClientes(transformedData);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    fetchDistribuidores();
    fetchClientes();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { CodigoDumont, idClientes, Marca, Modelo, NumSerie } = dispositivo;

    if (!CodigoDumont || !idClientes || !Marca || !Modelo || !NumSerie) {
      setErrorMessage("Todos los campos son obligatorios.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    // Realizar el dispatch para crear el dispositivo
    dispatch(
      dispositivoCreate({
        CodigoDumont,
        idClientes,
        Marca,
        Modelo,
        NumSerie,
      }),
    );

    setDispositivo({
      CodigoDumont: "",
      idClientes: "",
      Marca: "",
      Modelo: "",
      NumSerie: "",
    });

    setModal(true);
    setTimeout(() => {
      setModal(false);
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDispositivo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center my-5">
      {modal ? <ModalWindow text={"¡Dispositivo creado con éxito!"} /> : null}

      <h2 className="text-white text-3xl md:text-5xl font-semibold my-2">
        Registrar Dispositivo
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full lg:w-9/12 xl:w-10/12 px-4 text-white">
        <div className="container mx-auto grid grid-cols-1 w-full items-center xl:grid-cols-2 justify-items-center xl:items-center ">
          {/* Código Dumont (Distribuidor) */}
          <SelectField
            label="Código Dumont"
            name="CodigoDumont"
            value={dispositivo.CodigoDumont}
            onChange={(e) =>
              handleChange({
                target: { name: "CodigoDumont", value: e.target.value },
              })
            }
            options={[{ value: "", label: "Selecciona..." }, ...distribuidores]}
            className="col-span-1 xl:col-start-1 lg:w-[32rem] gap-3 font-semibold px-4"
          />

          {/* Código Cliente */}
          <SelectField
            label="Código Cliente"
            name="idClientes"
            value={dispositivo.idClientes}
            onChange={(e) =>
              handleChange({
                target: { name: "idClientes", value: e.target.value },
              })
            }
            options={[{ value: "", label: "Selecciona..." }, ...clientes]}
            className="col-span-1 xl:col-start-2 lg:w-[32rem] gap-3 font-semibold px-4"
          />

          {/* Marca */}
          <InputField
            label="Marca"
            id="Marca"
            name="Marca"
            value={dispositivo.Marca}
            onChange={handleChange}
            required
            className="col-span-1 xl:col-start-1 lg:w-[32rem] font-semibold px-4"
            inputClassName="font-light text-white"
          />

          {/* Modelo */}
          <InputField
            label="Modelo"
            id="Modelo"
            name="Modelo"
            value={dispositivo.Modelo}
            onChange={handleChange}
            required
            className="col-span-1 xl:col-start-2 lg:w-[32rem] font-semibold px-4"
            inputClassName="font-light text-white"
          />

          {/* Número de Serie */}
          <InputField
            label="Número de Serie"
            id="NumSerie"
            name="NumSerie"
            value={dispositivo.NumSerie}
            onChange={handleChange}
            required
            className="col-span-1 xl:col-start-1 lg:w-[32rem] font-semibold px-4"
            inputClassName="font-light text-white"
          />
        </div>

        {errorMessage && (
          <div className="p-2 h-8 text-xs rounded flex justify-center items-center bg-red-700 text-white font-medium relative">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          className="w-11/12 lg:w-[30rem] p-4 relative top-11 bg-[#427EF3] rounded-xl text-white text-lg tracking-wide font-semibold">
          Guardar
        </button>
      </form>
    </div>
  );
}

export default DispositivoRegistration;
