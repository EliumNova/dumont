const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
}) => (
  <div className="flex flex-col gap-3 w-[32rem] p-4 my-2">
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
      className="bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
    />
  </div>
);

export default InputField;
