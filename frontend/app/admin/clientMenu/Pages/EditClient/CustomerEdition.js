"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { setLoading, setError } from "@/lib/slices/clients/clientSlice";
import CompleteModal from "../../components/CompleteModal";
import { useSelector } from "react-redux";

function CustomerEdition() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Extraer el id de la URL

  const [showModal, setShowModal] = useState(false); // Estado del modal de éxito
  const [customerInfo, setCustomerInfo] = useState({
    principales: {
      NombreCompleto: "",
      CodigoCliente: "",
      Segmentacion: "",
      CondicionFiscal: "",
      CodigoDistribuidor: "",
      CorreoElectronico: "",
      Telefono: "",
      VentaAlcohol: false,
    },
    ubicacion: {
      localidad: "",
      calle: "",
      altura: "",
      entreCalle1: "",
      entreCalle2: "",
    },
    horus: {
      saleHorusFrom: "",
      saleHorusTo: "",
    },
  });

  const loading = useSelector((state) => state.clients.newCustomer.loading);

  // Cargar datos del cliente basados en el id
  useEffect(() => {
    if (!id) return;

    const fetchCustomerData = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/clientes/${id}`
        );

        const data = response.data;

        setCustomerInfo({
          principales: {
            NombreCompleto: data.NombreCompleto ?? "",
            CodigoCliente: data.CodigoCliente ?? "",
            Segmentacion: data.Segmentacion ?? "",
            CondicionFiscal: data.CondicionFiscal ?? "",
            CodigoDistribuidor: data.CodigoDistribuidor ?? "",
            CorreoElectronico: data.CorreoElectronico ?? "",
            Telefono: data.Telefono ?? "",
            VentaAlcohol: Boolean(data.VentaAlcohol),
          },
          ubicacion: {
            localidad: data.localidad ?? "",
            calle: data.calle ?? "",
            altura: data.altura ?? "",
            entreCalle1: data.entreCalle1 ?? "",
            entreCalle2: data.entreCalle2 ?? "",
          },
          horus: {
            saleHorusFrom: data.HorarioVenta?.split(" - ")[0] || "",
            saleHorusTo: data.HorarioVenta?.split(" - ")[1] || "",
          },
        });
      } catch (error) {
        dispatch(setError("Error al cargar los datos del cliente"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCustomerData();
  }, [id, dispatch]);

  const handleChange = (section, field, value) => {
    setCustomerInfo((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clientId = id;

    const payload = {
      NombreCompleto: customerInfo.principales.NombreCompleto,
      CodigoCliente: customerInfo.principales.CodigoCliente,
      Segmentacion: customerInfo.principales.Segmentacion,
      CondicionFiscal: customerInfo.principales.CondicionFiscal,
      CodigoDistribuidor: customerInfo.principales.CodigoDistribuidor,
      CorreoElectronico: customerInfo.principales.CorreoElectronico,

      // 🔥 CLAVE
      VentaAlcohol: customerInfo.principales.VentaAlcohol ? "SI" : "NO",
      Telefono: String(customerInfo.principales.Telefono),

      localidad: customerInfo.ubicacion.localidad,
      calle: customerInfo.ubicacion.calle,
      altura: String(customerInfo.ubicacion.altura),
      entreCalle1: customerInfo.ubicacion.entreCalle1,
      entreCalle2: customerInfo.ubicacion.entreCalle2,

      HorarioVenta:
        customerInfo.horus.saleHorusFrom && customerInfo.horus.saleHorusTo
          ? `${customerInfo.horus.saleHorusFrom} - ${customerInfo.horus.saleHorusTo}`
          : "",
    };

    console.log("📦 PAYLOAD ENVIADO:", payload);

    try {
      dispatch(setLoading(true));

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clientes/update/${clientId}`,
        payload
      );

      dispatch(setLoading(false));
      setShowModal(true);
    } catch (error) {
      dispatch(setLoading(false));

      if (error.response) {
        console.error("❌ ERROR BACKEND:", error.response.data);
        dispatch(setError(error.response.data));
      } else {
        console.error("❌ ERROR GENERAL:", error.message);
        dispatch(setError(error.message));
      }
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-start my-2 px-4 h-[90vh] overflow-y-auto">
      <h2 className="text-white text-4xl md:text-2xl font-semibold my-1">
        Edición de Clientes
      </h2>

      <form onSubmit={handleSubmit} className="w-full">
        {/* Sección Principales */}
        <div className="mb-8">
          <h3 className="text-white text-2xl font-semibold mb-4">
            Principales
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Nombre Completo"
              name="NombreCompleto"
              value={customerInfo.principales.NombreCompleto || ""}
              onChange={(e) =>
                handleChange("principales", "NombreCompleto", e.target.value)
              }
              placeholder="Ingresa tu nombre completo"
            />
            <InputField
              label="Código del cliente"
              name="CodigoCliente"
              value={customerInfo.principales.CodigoCliente || ""}
              onChange={(e) =>
                handleChange("principales", "CodigoCliente", e.target.value)
              }
              placeholder="Ingresa tu número de cliente"
            />
            <InputField
              label="Segmentación"
              name="Segmentacion"
              value={customerInfo.principales.Segmentacion}
              onChange={(e) =>
                handleChange("principales", "Segmentacion", e.target.value)
              }
            />

            <InputField
              label="Condición Fiscal"
              name="CondicionFiscal"
              value={customerInfo.principales.CondicionFiscal}
              onChange={(e) =>
                handleChange("principales", "CondicionFiscal", e.target.value)
              }
            />

            <InputField
              label="Código Distribuidor"
              name="CodigoDistribuidor"
              value={customerInfo.principales.CodigoDistribuidor}
              onChange={(e) =>
                handleChange(
                  "principales",
                  "CodigoDistribuidor",
                  e.target.value
                )
              }
            />

            <InputField
              label="Correo Electrónico"
              name="CorreoElectronico"
              type="email"
              value={customerInfo.principales.CorreoElectronico}
              onChange={(e) =>
                handleChange("principales", "CorreoElectronico", e.target.value)
              }
            />

            <InputField
              label="Teléfono"
              name="Telefono"
              value={customerInfo.principales.Telefono}
              onChange={(e) =>
                handleChange("principales", "Telefono", e.target.value)
              }
            />
            <label className="text-white flex items-center gap-2">
              <input
                type="checkbox"
                checked={customerInfo.principales.VentaAlcohol}
                onChange={(e) =>
                  handleChange("principales", "VentaAlcohol", e.target.checked)
                }
              />
              Venta de Alcohol
            </label>

            {/* Agrega más campos de la sección Principales aquí */}
          </div>
        </div>

        {/* Sección Ubicación */}
        <div className="mb-8">
          <h3 className="text-white text-2xl font-semibold mb-4">Ubicación</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Localidad"
              name="localidad"
              value={customerInfo.ubicacion.localidad || ""}
              onChange={(e) =>
                handleChange("ubicacion", "localidad", e.target.value)
              }
              placeholder="Ingresa tu localidad"
            />
            <InputField
              label="Calle"
              name="calle"
              value={customerInfo.ubicacion.calle || ""}
              onChange={(e) =>
                handleChange("ubicacion", "calle", e.target.value)
              }
              placeholder="Ingresa tu calle"
            />
            <InputField
              label="Altura"
              name="altura"
              value={customerInfo.ubicacion.altura}
              onChange={(e) =>
                handleChange("ubicacion", "altura", e.target.value)
              }
            />

            <InputField
              label="Entre calle 1"
              name="entreCalle1"
              value={customerInfo.ubicacion.entreCalle1}
              onChange={(e) =>
                handleChange("ubicacion", "entreCalle1", e.target.value)
              }
            />

            <InputField
              label="Entre calle 2"
              name="entreCalle2"
              value={customerInfo.ubicacion.entreCalle2}
              onChange={(e) =>
                handleChange("ubicacion", "entreCalle2", e.target.value)
              }
            />

            {/* Agrega más campos de la sección Ubicación aquí */}
          </div>
        </div>

        {/* Sección Horus */}
        <div className="mb-8">
          <h3 className="text-white text-2xl font-semibold mb-4">Horus</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Horario de venta (Desde)"
              name="saleHorusFrom"
              type="time"
              value={customerInfo.horus.saleHorusFrom || ""}
              onChange={(e) =>
                handleChange("horus", "saleHorusFrom", e.target.value)
              }
            />
            <InputField
              label="Horario de venta (Hasta)"
              name="saleHorusTo"
              type="time"
              value={customerInfo.horus.saleHorusTo || ""}
              onChange={(e) =>
                handleChange("horus", "saleHorusTo", e.target.value)
              }
            />
            {/* Agrega más campos de la sección Horus aquí */}
          </div>
        </div>

        <div className="flex gap-5 flex-col sm:flex-row my-5">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="w-[15rem] h-12 bg-transparent border-principal border-2 rounded-xl text-principal text-lg tracking-wide font-semibold">
            Cancelar
          </button>
          <button
            type="submit"
            className="w-[15rem] h-12 bg-[#427EF3] rounded-xl text-white text-lg tracking-wide font-semibold">
            Guardar cambios
          </button>
        </div>
      </form>

      {showModal && <CompleteModal setShowModal={setShowModal} />}
    </div>
  );
}

export default CustomerEdition;

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div className="flex flex-col w-full">
    <label htmlFor={name} className="text-sm font-semibold text-white">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="bg-[#E2E5E5] h-12 rounded-lg p-4 text-base w-full text-black"
    />
  </div>
);
