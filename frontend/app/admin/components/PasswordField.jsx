import { GoEye } from 'react-icons/go';
import { RiEyeCloseLine } from 'react-icons/ri';

export default function PasswordField({
  label,
  name,
  value,
  showPassword,
  togglePassword,
  onChange,
  required,
  className = '', // Permitir pasar clases adicionales
}) {
  return (
    <div
      className={`w-full lg:w-[32rem] p-4 ${className}`} // Ocupa toda la columna
    >
      <label htmlFor={name} className="text-sm font-semibold">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="Crear nueva contraseña"
          required={required}
          className="bg-[#E2E5E5] h-14 rounded-lg p-4 pr-12 text-base w-full"
        />
        <div
          className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center cursor-pointer"
          onClick={togglePassword}
        >
          {showPassword ? (
            <GoEye className="w-5 h-5" />
          ) : (
            <RiEyeCloseLine className="w-5 h-5" />
          )}
        </div>
      </div>
    </div>
  );
}
