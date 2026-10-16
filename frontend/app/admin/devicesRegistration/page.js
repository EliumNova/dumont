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
    CodigoDistribuidor: "", // solo se usa para filtrar clientes, no se envía
    CodigoCliente: "", // código de negocio del cliente elegido (ej. "1002")
    CodigoDumont: "", // se autocompleta a partir del cliente, solo lectura
    Marca: "",
    Modelo: "",
    NumSerie: "",
  });
  const [modal, setModal] = useState(false);
  const [distribuidores, setDistribuidores] = useState([]);
  const [clientes, setClientes] = useState([]); // lista completa sin transformar

  // Obtener distribuidores y clientes al cargar el componente
  useEffect(() => {
    const fetchDistribuidores = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/distribuidores/?pageSize=10000`,
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/clientes/?pageSize=10000`,
        );
        if (!response.ok) {
          throw new Error("Error al obtener los clientes");
        }
        const data = await response.json();
        // Guardamos los clientes completos (sin transformar) para poder
        // filtrarlos por distribuidor y leer su CodigoDumont ya asignado.
        setClientes(data.rows || []);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    fetchDistribuidores();
    fetchClientes();
  }, []);

  // Clientes que pertenecen al distribuidor seleccionado
  const clientesDelDistribuidor = dispositivo.CodigoDistribuidor
    ? clientes.filter(
        (c) =>
          String(c.CodigoDistribuidor) === String(dispositivo.CodigoDistribuidor),
      )
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const { CodigoCliente, Marca, Modelo, NumSerie } = dispositivo;

    if (
      !dispositivo.CodigoDistribuidor ||
      !CodigoCliente ||
      !Marca ||
      !Modelo ||
      !NumSerie
    ) {
      setErrorMessage("Todos los campos son obligatorios.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    // El Código Dumont lo arma y valida el backend a partir del cliente
    // elegido; solo lo mandamos como referencia informativa. El backend
    // espera el código de negocio del cliente en "CodigoCliente" (la FK
    // real de Dispositivos apunta a Clientes.CodigoCliente, no al UUID).
    dispatch(
      dispositivoCreate({
        CodigoCliente,
        CodigoDumont: dispositivo.CodigoDumont,
        Marca,
        Modelo,
        NumSerie,
      }),
    );

    setDispositivo({
      CodigoDistribuidor: "",
      CodigoCliente: "",
      CodigoDumont: "",
      Marca: "",
      Modelo: "",
      NumSerie: "",
    });

    setModal(true);
    setTimeout(() => {
      setModal(false);
    }, 3000);
  };

  const handleDistribuidorChange = (e) => {
    // Al cambiar de distribuidor se resetea el cliente y el código Dumont
    // ya que dependen de la selección anterior.
    setDispositivo((prev) => ({
      ...prev,
      CodigoDistribuidor: e.target.value,
      CodigoCliente: "",
      CodigoDumont: "",
    }));
  };

  const handleClienteChange = (e) => {
    // El backend espera el CÓDIGO DE NEGOCIO del cliente (CodigoCliente,
    // ej. "1002"), no su idClientes (UUID) — la FK real de Dispositivos
    // apunta a Clientes.CodigoCliente.
    const codigoCliente = e.target.value;
    const clienteElegido = clientes.find(
      (c) => String(c.CodigoCliente) === String(codigoCliente),
    );

    setDispositivo((prev) => ({
      ...prev,
      CodigoCliente: codigoCliente,
      CodigoDumont: clienteElegido?.CodigoDumont || "",
    }));
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
          {/* Distribuidor */}
          <SelectField
            label="Distribuidor"
            name="CodigoDistribuidor"
            value={dispositivo.CodigoDistribuidor}
            onChange={handleDistribuidorChange}
            options={[{ value: "", label: "Selecciona..." }, ...distribuidores]}
            className="col-span-1 xl:col-start-1 lg:w-[32rem] gap-3 font-semibold px-4"
          />

          {/* Cliente (filtrado por el distribuidor elegido) */}
          <SelectField
            label="Cliente"
            name="CodigoCliente"
            value={dispositivo.CodigoCliente}
            onChange={handleClienteChange}
            disabled={!dispositivo.CodigoDistribuidor}
            options={[
              {
                value: "",
                label: dispositivo.CodigoDistribuidor
                  ? "Selecciona..."
                  : "Primero elegí un distribuidor",
              },
              ...clientesDelDistribuidor.map((c) => ({
                value: c.CodigoCliente,
                label: `${c.CodigoCliente} - ${c.NombreCompleto}`,
              })),
            ]}
            className="col-span-1 xl:col-start-2 lg:w-[32rem] gap-3 font-semibold px-4"
          />

          {/* Código Dumont: se asigna solo, según el cliente elegido */}
          <InputField
            label="Código Dumont"
            name="CodigoDumont"
            value={dispositivo.CodigoDumont}
            onChange={() => {}}
            disabled
            placeholder="Se completa al elegir el cliente"
            inputClassName="col-span-1 xl:col-start-1 lg:w-[32rem] font-semibold px-4"
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
