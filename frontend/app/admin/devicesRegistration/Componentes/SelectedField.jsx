const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  inputClassName,
  className,
  disabled,
}) => (
  <div
    className={`flex flex-col  w-full  2xl:w-full ${inputClassName || ""} ${
      className || ""
    }`}
  >
    <label htmlFor={name} className="text-sm font-semibold">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      disabled={disabled}
      className="bg-[#E2E5E5] h-12 rounded-lg p-2 text-sm text-black disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default SelectField;
