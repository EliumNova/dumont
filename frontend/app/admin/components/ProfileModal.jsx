"use client";

export default function ProfileModal({ data, onClose, onOpenCartera }) {
  const raw = data.raw || {};

  console.log("RAW DATA:", data.raw);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[520px] shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          {data.type === "cliente"
            ? "Perfil del Cliente"
            : "Perfil del Distribuidor"}
        </h2>

        <p>
          <strong>Nombre:</strong> {data.name}
        </p>

        {data.type === "cliente" && (
          <>
            <p>
              <strong>Código Dumont:</strong> {raw.CodigoDumont || "—"}
            </p>
            <p>
              <strong>Dirección:</strong>{" "}
              {raw.Calle && raw.Altura ? `${raw.Calle} ${raw.Altura}` : "—"}
            </p>
            <p>
              <strong>Localidad:</strong> {raw.Localidad || "—"}
            </p>

            <p>
              <strong>Teléfono:</strong> {raw.Telefono || "—"}
            </p>
            <p>
              <strong>Email:</strong> {raw.CorreoElectronico || "—"}
            </p>
          </>
        )}

        {data.type === "distribuidor" && (
          <>
            <p>
              <strong>Código Distribuidor:</strong>{" "}
              {raw.CodigoDistribuidor || "—"}
            </p>
            <p>
              <strong>Localidad:</strong> {raw.Localidad || "—"}
            </p>
            <p>
              <strong>Email:</strong> {raw.Email || "—"}
            </p>

            <button
              onClick={() => onOpenCartera(data)}
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded">
              Ver Cartera
            </button>
          </>
        )}

        <button
          className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
