"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { setLoading, setError } from "@/lib/slices/clients/clientSlice";
import CompleteModal from "../../components/CompleteModal_Update";

function CustomerEdition() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [showModal, setShowModal] = useState(false);

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
      Localidad: "",
      Calle: "",
      Altura: "",
      EntreCalle1: "",
      EntreCalle2: "",
    },
    horus: {
      tipo: "corrido",
      desde1: "",
      hasta1: "",
      desde2: "",
      hasta2: "",
    },
  });

  const loading = useSelector((state) => state.clients.newCustomer.loading);

  // 🔥 Parseo horario
  const parseHorario = (horario) => {
    if (!horario) return {};

    if (horario.includes("/")) {
      const [t1, t2] = horario.split(" / ");
      const [desde1, hasta1] = t1.split(" - ");
      const [desde2, hasta2] = t2.split(" - ");

      return { tipo: "doble", desde1, hasta1, desde2, hasta2 };
    } else {
      const [desde1, hasta1] = horario.split(" - ");
      return { tipo: "corrido", desde1, hasta1 };
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchCustomerData = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/clientes/${id}`,
        );

        const data = res.data;
        const horario = parseHorario(data.HorarioVenta);

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
            Localidad: data.Localidad ?? "",
            Calle: data.Calle ?? "",
            Altura: data.Altura ?? "",
            EntreCalle1: data.EntreCalle1 ?? "",
            EntreCalle2: data.EntreCalle2 ?? "",
          },
          horus: {
            tipo: horario.tipo || "corrido",
            desde1: horario.desde1 || "",
            hasta1: horario.hasta1 || "",
            desde2: horario.desde2 || "",
            hasta2: horario.hasta2 || "",
          },
        });
      } catch (error) {
        dispatch(setError("Error al cargar cliente"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCustomerData();
  }, [id, dispatch]);

  const handleChange = (section, field, value) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const buildHorario = () => {
    const { tipo, desde1, hasta1, desde2, hasta2 } = customerInfo.horus;

    if (tipo === "doble") {
      return `${desde1} - ${hasta1} / ${desde2} - ${hasta2}`;
    }
    return `${desde1} - ${hasta1}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      NombreCompleto: customerInfo.principales.NombreCompleto,
      CodigoCliente: customerInfo.principales.CodigoCliente,
      Segmentacion: customerInfo.principales.Segmentacion,
      CondicionFiscal: customerInfo.principales.CondicionFiscal,
      CodigoDistribuidor: customerInfo.principales.CodigoDistribuidor,
      CorreoElectronico: customerInfo.principales.CorreoElectronico,

      // 🔥 FIX 1: BOOLEAN REAL
      VentaAlcohol: customerInfo.principales.VentaAlcohol,

      Telefono: String(customerInfo.principales.Telefono),

      // 🔥 FIX 2: MINÚSCULAS
      localidad: customerInfo.ubicacion.Localidad,
      calle: customerInfo.ubicacion.Calle,
      altura: String(customerInfo.ubicacion.Altura),
      entreCalle1: customerInfo.ubicacion.EntreCalle1,
      entreCalle2: customerInfo.ubicacion.EntreCalle2,

      HorarioVenta: buildHorario(),
    };

    console.log("📦 PAYLOAD:", payload);

    try {
      dispatch(setLoading(true));

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clientes/update/${id}`,
        payload,
      );

      setShowModal(true);
      router.push("/admin");
    } catch (error) {
      console.error(error.response?.data);
      dispatch(setError(error.response?.data));
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-white text-3xl my-4">Edición de Clientes</h2>

      <form onSubmit={handleSubmit}>
        {/* PRINCIPALES */}
        <h3 className="text-white text-xl mb-2">Principales</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nombre"
            value={customerInfo.principales.NombreCompleto}
            onChange={(e) =>
              handleChange("principales", "NombreCompleto", e.target.value)
            }
          />
          <Input
            label="Código Cliente"
            value={customerInfo.principales.CodigoCliente}
            onChange={(e) =>
              handleChange("principales", "CodigoCliente", e.target.value)
            }
          />
          <Input
            label="Segmentación"
            value={customerInfo.principales.Segmentacion}
            onChange={(e) =>
              handleChange("principales", "Segmentacion", e.target.value)
            }
          />
          <Input
            label="Condición Fiscal"
            value={customerInfo.principales.CondicionFiscal}
            onChange={(e) =>
              handleChange("principales", "CondicionFiscal", e.target.value)
            }
          />
          <Input
            label="Código Distribuidor"
            value={customerInfo.principales.CodigoDistribuidor}
            onChange={(e) =>
              handleChange("principales", "CodigoDistribuidor", e.target.value)
            }
          />
          <Input
            label="Email"
            value={customerInfo.principales.CorreoElectronico}
            onChange={(e) =>
              handleChange("principales", "CorreoElectronico", e.target.value)
            }
          />
          <Input
            label="Teléfono"
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
            Venta Alcohol
          </label>
        </div>

        {/* UBICACION */}
        <h3 className="text-white text-xl mt-6 mb-2">Ubicación</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Localidad"
            value={customerInfo.ubicacion.Localidad}
            onChange={(e) =>
              handleChange("ubicacion", "Localidad", e.target.value)
            }
          />
          <Input
            label="Calle"
            value={customerInfo.ubicacion.Calle}
            onChange={(e) => handleChange("ubicacion", "Calle", e.target.value)}
          />
          <Input
            label="Altura"
            value={customerInfo.ubicacion.Altura}
            onChange={(e) =>
              handleChange("ubicacion", "Altura", e.target.value)
            }
          />
          <Input
            label="Entre calle 1"
            value={customerInfo.ubicacion.EntreCalle1}
            onChange={(e) =>
              handleChange("ubicacion", "EntreCalle1", e.target.value)
            }
          />
          <Input
            label="Entre calle 2"
            value={customerInfo.ubicacion.EntreCalle2}
            onChange={(e) =>
              handleChange("ubicacion", "EntreCalle2", e.target.value)
            }
          />
        </div>

        {/* HORARIO */}
        <h3 className="text-white text-xl mt-6 mb-2">Horario</h3>

        <select
          value={customerInfo.horus.tipo}
          onChange={(e) => handleChange("horus", "tipo", e.target.value)}>
          <option value="corrido">Corrido</option>
          <option value="doble">Doble turno</option>
        </select>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <Input
            type="time"
            label="Desde"
            value={customerInfo.horus.desde1}
            onChange={(e) => handleChange("horus", "desde1", e.target.value)}
          />
          <Input
            type="time"
            label="Hasta"
            value={customerInfo.horus.hasta1}
            onChange={(e) => handleChange("horus", "hasta1", e.target.value)}
          />

          {customerInfo.horus.tipo === "doble" && (
            <>
              <Input
                type="time"
                label="Desde tarde"
                value={customerInfo.horus.desde2}
                onChange={(e) =>
                  handleChange("horus", "desde2", e.target.value)
                }
              />
              <Input
                type="time"
                label="Hasta tarde"
                value={customerInfo.horus.hasta2}
                onChange={(e) =>
                  handleChange("horus", "hasta2", e.target.value)
                }
              />
            </>
          )}
        </div>

        <button className="bg-blue-500 text-white px-6 py-3 mt-6 rounded">
          Guardar
        </button>
      </form>

      {showModal && <CompleteModal setShowModal={setShowModal} />}
    </div>
  );
}

export default CustomerEdition;

const Input = ({ label, value, onChange, type = "text" }) => (
  <div className="flex flex-col">
    <label className="text-white">{label}</label>
    <input
      type={type}
      value={value || ""}
      onChange={onChange}
      className="h-10 px-2 rounded text-black"
      required
    />
  </div>
);
