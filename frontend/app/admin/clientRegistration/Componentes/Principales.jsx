"use client";
import { setPrincipales } from "@/lib/slices/clients/clientSlice";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputField from "./InputField";
import SelectField from "./SelectedField";

function Principales({ onNext, onBack }) {
  const dispatch = useDispatch();
  const storePrincipales = useSelector(
    (state) => state.clients.newCustomer.principales
  );

  const [principalesInfo, setPrincipalesInfo] = useState({
    NombreCompleto: storePrincipales?.NombreCompleto || "",
    CodigoCliente: storePrincipales?.CodigoCliente || "",
    Segmentacion: storePrincipales?.Segmentacion || "",
    CodigoDistribuidor: storePrincipales?.CodigoDistribuidor || "",
    CodigoDumont: storePrincipales?.CodigoDumont || "",
    CorreoElectronico: storePrincipales?.CorreoElectronico || "",
    VentaAlcohol: storePrincipales?.VentaAlcohol || "",
    Telefono: storePrincipales?.Telefono || "",
    CondicionFiscal: storePrincipales?.CondicionFiscal || "",
  });

  const [distribuidores, setDistribuidores] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  // 🔹 Generar el código DuMont (una sola vez declarada)
  const generateCodigoDuMont = () => {
    const { CodigoDistribuidor, CodigoCliente } = principalesInfo;

    const codigoDistribuidorStr = CodigoDistribuidor?.toString() || "";
    const codigoClienteStr = CodigoCliente?.toString() || "";

    if (!codigoDistribuidorStr || !codigoClienteStr) {
      return "";
    }

    const cerosNecesarios =
      14 - (codigoDistribuidorStr.length + codigoClienteStr.length);

    if (cerosNecesarios < 0) {
      return "";
    }

    const ceros = "0".repeat(Math.max(0, cerosNecesarios));
    const codigoDumont =
      `${codigoDistribuidorStr}${ceros}${codigoClienteStr}`.slice(0, 14);

    setPrincipalesInfo((prevState) => ({
      ...prevState,
      CodigoDumont: codigoDumont,
    }));
  };

  // 🔹 Obtener los distribuidores al cargar el componente
  useEffect(() => {
    const fetchDistribuidores = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/clientes/distribuidores/list`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los distribuidores");
        }
        const data = await response.json();

        const transformedData = data.map((distribuidor) => ({
          value: distribuidor.CodigoDistribuidor.toString(),
          label: `${distribuidor.CodigoDistribuidor} - ${distribuidor.NombreComercial}`,
        }));

        setDistribuidores(transformedData);
      } catch (error) {
        console.error("Error al obtener los distribuidores:", error);
      }
    };

    fetchDistribuidores();
  }, []);

  // 🔹 Generar el código DuMont cuando cambian los códigos
  useEffect(() => {
    generateCodigoDuMont();
  }, [principalesInfo.CodigoDistribuidor, principalesInfo.CodigoCliente]);

  // 🔹 Forzar VentaAlcohol en base a la condición fiscal
  useEffect(() => {
    if (principalesInfo.CondicionFiscal === "RI") {
      setPrincipalesInfo((prev) => ({
        ...prev,
        VentaAlcohol: "1",
      }));
    } else if (principalesInfo.VentaAlcohol === "1") {
      setPrincipalesInfo((prev) => ({
        ...prev,
        VentaAlcohol: "",
      }));
    }
  }, [principalesInfo.CondicionFiscal]);

  const validateCorreoElectronico = (CorreoElectronico) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(CorreoElectronico);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = type === "checkbox" ? checked : value;

    // 🔹 Limitar CódigoCliente a 4 caracteres
    if (name === "CodigoCliente") {
      newValue = newValue.slice(0, 4);
    }

    setPrincipalesInfo((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      "NombreCompleto",
      "CodigoCliente",
      "CodigoDistribuidor",
      "Segmentacion",
      "CorreoElectronico",
      "VentaAlcohol",
      "Telefono",
      "CondicionFiscal",
    ];

    requiredFields.forEach((field) => {
      if (!principalesInfo[field]) {
        errors[field] = "Este campo es obligatorio";
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrorMessage("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const { CorreoElectronico } = principalesInfo;

    if (!validateCorreoElectronico(CorreoElectronico)) {
      setErrorMessage("El CorreoElectronico debe tener un formato válido.");
      return;
    }

    dispatch(setPrincipales(principalesInfo));
    onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-full flex flex-col items-center w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-2 text-xs text-white">
        <InputField
          label="Nombre Completo"
          name="NombreCompleto"
          value={principalesInfo.NombreCompleto}
          onChange={handleChange}
          placeholder="Ingresa tu nombre completo"
          error={formErrors.NombreCompleto}
          className="h-8 text-xs"
        />

        <InputField
          label="Código del cliente"
          name="CodigoCliente"
          value={principalesInfo.CodigoCliente}
          onChange={handleChange}
          placeholder="Ingresa tu número de cliente"
          error={formErrors.CodigoCliente}
          className="h-8 text-xs"
        />

        <InputField
          label="Correo electrónico"
          name="CorreoElectronico"
          type="email"
          value={principalesInfo.CorreoElectronico}
          onChange={handleChange}
          placeholder="Ingresa tu correo electrónico"
          error={formErrors.CorreoElectronico}
          className="h-8 text-xs"
        />

        <SelectField
          label="Código del distribuidor"
          name="CodigoDistribuidor"
          value={principalesInfo.CodigoDistribuidor}
          onChange={handleChange}
          options={[{ value: "", label: "Selecciona..." }, ...distribuidores]}
          error={formErrors.CodigoDistribuidor}
          className="h-8 text-xs"
        />

        <SelectField
          label="Segmentación"
          name="Segmentacion"
          value={principalesInfo.Segmentacion}
          onChange={handleChange}
          options={[
            { value: "", label: "Selecciona..." },
            { value: "Kiosco", label: "Kiosco" },
            { value: "Almacen", label: "Almacen" },
            { value: "Autoservicio", label: "Autoservicio" },
          ]}
          error={formErrors.Segmentacion}
          className="h-8 text-xs"
        />

        <InputField
          label="Código DuMont"
          name="CodigoDumont"
          value={principalesInfo.CodigoDumont}
          readOnly
          placeholder="Código generado automáticamente"
          className="h-8 text-xs cursor-not-allowed"
        />

        <SelectField
          label="Condición Fiscal"
          name="CondicionFiscal"
          value={principalesInfo.CondicionFiscal}
          onChange={handleChange}
          options={[
            { value: "", label: "Selecciona..." },
            { value: "CF", label: "Consumidor Final" },
            { value: "RI", label: "Responsable Inscripto" },
            { value: "MT", label: "Monotributista" },
          ]}
          error={formErrors.CondicionFiscal}
          className="h-8 text-xs"
        />

        <InputField
          label="Teléfono"
          name="Telefono"
          value={principalesInfo.Telefono}
          placeholder="Ingresa tu número de teléfono"
          onChange={handleChange}
          error={formErrors.Telefono}
          className="h-8 text-xs"
        />
      </div>

      <SelectField
        label="Permiso Venta Alcohol"
        name="VentaAlcohol"
        value={principalesInfo.VentaAlcohol}
        onChange={handleChange}
        options={[
          { value: "", label: "Selecciona..." },
          { value: "1", label: "Sí" },
          { value: "2", label: "No" },
        ]}
        error={formErrors.VentaAlcohol}
        className="h-8 text-xs"
        disabled={principalesInfo.CondicionFiscal === "RI"}
      />

      {errorMessage && (
        <div className="w-full mt-4 p-2 text-center text-red-500 bg-red-100 rounded">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-5 flex-col sm:flex-row my-5">
        <button
          type="button"
          onClick={onBack}
          className="w-[15rem] h-12 bg-transparent border-principal border-2 rounded-xl text-principal text-lg tracking-wide font-semibold">
          Cancelar
        </button>
        <button
          type="submit"
          className="w-[15rem] h-12 bg-[#427EF3] rounded-xl text-white text-lg tracking-wide font-semibold">
          Siguiente
        </button>
      </div>
    </form>
  );
}

export default Principales;
