const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  inputClassName = '',
}) => (
  <div className={`flex flex-col w-full w-full  ${inputClassName}`}>
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
      className={`bg-[#E2E5E5] h-14 rounded-lg p-4 text-base w-full text-black`}
    />
  </div>
);

export default InputField;
