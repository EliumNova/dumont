export default function InputField({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  className = "", // Nueva prop para pasar clases adicionales
}) {
  return (
    <div className={`w-full flex flex-col lg:w-[32rem] p-4 my-2 ${className}`}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="bg-[#E2E5E5] h-14 rounded-lg p-4 text-base w-full"
      />
    </div>
  );
}
