const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  inputClassName = '',
  disabled = false, // Prop opcional para deshabilitar el input
}) => (
  <div className={`flex flex-col w-full ${inputClassName}`}>
    <label htmlFor={name} className="text-sm font-semibold">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      disabled={disabled} // Aplicar el atributo disabled
      className={`bg-[#E2E5E5] h-12 rounded-lg p-4 text-base w-full text-black ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    />
  </div>
);

export default InputField;
