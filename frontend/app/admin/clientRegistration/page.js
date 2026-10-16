"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import Principales from "./Componentes/Principales";
import Ubicacion from "./Componentes/Ubicacion";
import Horus from "./Componentes/Horus";
import FormCard, { Aviso } from "../components/FormCard";
import ConfirmDialog from "../components/ConfirmDialog";
import { setLoading, setError } from "@/lib/slices/clients/clientSlice";

const PASOS = ["Datos principales", "Ubicación", "Horario"];

function CustomerRegistration() {
  const dispatch = useDispatch();
  const router = useRouter();
  const newCustomerStore = useSelector((state) => state.clients.newCustomer);

  const [step, setStep] = useState(1);
  const [exito, setExito] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/clientes/create`;

  const handleNext = () => step < 3 && setStep(step + 1);
  const handleBack = () => step > 1 && setStep(step - 1);

  const handleSubmit = async () => {
    setErrorGeneral("");
    setEnviando(true);
    try {
      // Plano: principales + ubicación + horario. Teléfono y demás numéricos
      // ya vienen como dígitos puros (el formato es solo visual).
      const payload = {
        ...newCustomerStore.principales,
        ...newCustomerStore.ubicacion,
        ...newCustomerStore.horus,
        VentaAlcohol: Number(newCustomerStore.principales.VentaAlcohol),
      };
      dispatch(setLoading(true));
      await axios.post(URL, payload, { headers: { "Content-Type": "application/json" } });
      dispatch(setLoading(false));
      setExito(true);
    } catch (error) {
      console.error("Error al enviar datos a la API:", error);
      dispatch(setLoading(false));
      dispatch(setError(error.message));
      setErrorGeneral(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "No se pudo registrar el cliente. Revisá los datos e intentá de nuevo."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <FormCard
        title="Registrar cliente"
        subtitle={`Paso ${step} de 3 · ${PASOS[step - 1]}`}
        onBack={() => (step === 1 ? router.push("/admin") : handleBack())}
        maxWidth="max-w-4xl">
        {/* Indicador de pasos */}
        <ol className="mb-6 flex items-center gap-2">
          {PASOS.map((nombre, i) => {
            const n = i + 1;
            const hecho = n < step;
            const activo = n === step;
            return (
              <li key={nombre} className="flex flex-1 items-center gap-2">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    hecho ? "bg-green-500 text-white" : activo ? "bg-blue-500 text-white" : "bg-black/10 text-gray-500"
                  }`}>
                  {hecho ? "✓" : n}
                </span>
                <span className={`hidden text-xs font-medium sm:block ${activo ? "text-[#191920]" : "text-gray-400"}`}>{nombre}</span>
                {n < 3 && <span className={`h-0.5 flex-1 rounded ${hecho ? "bg-green-400" : "bg-black/10"}`} />}
              </li>
            );
          })}
        </ol>

        <Aviso>{errorGeneral}</Aviso>

        {step === 1 && <Principales onNext={handleNext} onBack={() => router.push("/admin")} />}
        {step === 2 && <Ubicacion onNext={handleNext} onBack={handleBack} />}
        {step === 3 && <Horus onSubmit={handleSubmit} onBack={handleBack} enviando={enviando} />}
      </FormCard>

      <ConfirmDialog
        isOpen={exito}
        danger={false}
        icon="✓"
        hideCancel
        title="¡Cliente registrado!"
        message="Ya figura en la lista de clientes."
        confirmText="Volver al menú"
        onConfirm={() => router.push("/admin")}
        onCancel={() => router.push("/admin")}
      />
    </>
  );
}

export default CustomerRegistration;
