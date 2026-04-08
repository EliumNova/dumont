"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import Principales from "./Componentes/Principales";
import Ubicacion from "./Componentes/Ubicacion";
import Horus from "./Componentes/Horus";
import CompleteModal from "./Componentes/CompleteModal";
import { setLoading, setError } from "@/lib/slices/clients/clientSlice";

function CustomerRegistration() {
  const dispatch = useDispatch();
  const router = useRouter();
  const newCustomerStore = useSelector((state) => state.clients.newCustomer);

  const [step, setStep] = useState(1); // Paso actual del formulario
  const [progress, setProgress] = useState(33); // Progreso del formulario
  const [showModal, setShowModal] = useState(false); // Estado del modal de éxito

  const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/clientes/create`;

  const handleNext = () => {
    // Avanzar al siguiente paso sin validar campos obligatorios
    if (step < 3) {
      setStep(step + 1);
      setProgress(progress + 33);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(progress - 33);
    }
  };

  const handleSubmit = async () => {
    try {
      // Combinar los datos de principales, ubicacion y horus en una estructura plana
      const payload = {
        ...newCustomerStore.principales,
        ...newCustomerStore.ubicacion,
        ...newCustomerStore.horus,

        // 🔥 aseguramos tipo correcto
        VentaAlcohol: Number(newCustomerStore.principales.VentaAlcohol),
      };

      dispatch(setLoading(true)); // Activa el estado de carga
      console.log("Enviando solicitud a la API:", URL);
      console.log("Datos enviados:", payload);

      console.log("TIPO VentaAlcohol:", typeof payload.VentaAlcohol);
      console.log("VALOR VentaAlcohol:", payload.VentaAlcohol);

      // Envía todos los datos del formulario al servidor
      const response = await axios.post(URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Respuesta de la API:", response.data);
      dispatch(setLoading(false)); // Desactiva el estado de carga
      setShowModal(true); // Muestra el modal de éxito

      // Redirige al usuario después de 3 segundos
      setTimeout(() => {
        router.push("/admin");
      }, 2500);
    } catch (error) {
      console.error("Error al enviar datos a la API:", error);
      dispatch(setLoading(false)); // Desactiva el estado de carga
      dispatch(setError(error.message)); // Guarda el mensaje de error en Redux
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-start my-2 px-4 h-[90vh] overflow-y-auto">
      <h2 className="text-white text-4xl md:text-2xl font-semibold my-1">
        Registro de Clientes
      </h2>
      <div className="w-full bg-gray-300 h-1 rounded mb-2">
        <div
          className="h-full bg-black rounded"
          style={{
            width: `${progress}%`,
            transition: "width 0.3s ease-in-out",
          }}
        />
      </div>

      {step === 1 && (
        <Principales onNext={handleNext} onBack={() => router.push("/admin")} />
      )}
      {step === 2 && <Ubicacion onNext={handleNext} onBack={handleBack} />}
      {step === 3 && (
        <Horus
          onSubmit={handleSubmit} // Pasa handleSubmit como prop
          onBack={handleBack}
          setShowModal={setShowModal}
        />
      )}

      {showModal && <CompleteModal setShowModal={setShowModal} />}
    </div>
  );
}

export default CustomerRegistration;
