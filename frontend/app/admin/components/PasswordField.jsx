import { GoEye } from "react-icons/go"; // Asegúrate de importar los íconos necesarios
import { RiEyeCloseLine } from "react-icons/ri"; // Asegúrate de importar los íconos necesarios

export default function PasswordField({
  label,
  name,
  value,
  showPassword,
  togglePassword,
  onChange,
  required,
}) {
  return (
    <div className="flex flex-col gap-3 w-[32rem] pt-1 p-4 my-2">
      <label htmlFor={name} className="text-sm font-semibold">
        {label}
      </label>
      <input
        type={showPassword ? "text" : "password"}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder="Crear nueva contraseña"
        required={required}
        className="bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
      />
      {showPassword ? (
        <GoEye
          onClick={togglePassword}
          className="relative self-end bottom-11 right-4 w-5 h-5 cursor-pointer"
        />
      ) : (
        <RiEyeCloseLine
          onClick={togglePassword}
          className="relative self-end bottom-11 right-4 w-5 h-5 cursor-pointer"
        />
      )}
    </div>
  );
}
