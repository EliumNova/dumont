"use client";
import React from "react";

export default function PhoneInput({
  label = "Teléfono",
  name = "Telefono",
  value,
  onChange,
  className = "",
  inputClassName = "",
}) {
  // Función para aplicar máscara dinámica
  const formatPhone = (raw) => {
    // Quitar lo que no sea número
    let v = raw.replace(/\D/g, "");

    // Aplicar máscara según longitud
    if (v.length > 3 && v.length <= 7) {
      v = `(${v.slice(0, 3)}) ${v.slice(3)}`;
    } else if (v.length > 7) {
      v = `(${v.slice(0, 3)}) ${v.slice(3, 7)}-${v.slice(7, 11)}`;
    }

    return v;
  };

  const handleInput = (e) => {
    const masked = formatPhone(e.target.value);

    // Dispara el mismo handleChange del form
    onChange({
      target: {
        name,
        value: masked,
      },
    });
  };

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <label className="text-sm font-semibold">{label}</label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={handleInput}
        maxLength={16}
        placeholder="(123) 4567-8910"
        className={`bg-[#E2E5E5] h-14 rounded-lg p-4 text-base text-black ${inputClassName}`}
      />
    </div>
  );
}
