const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  inputClassName,
}) => (
  <div
    className={`flex flex-col gap-3 w-full lg:w-[32rem] my-2 ${inputClassName}`}
  >
    <label htmlFor={name} className="text-sm font-semibold">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      className="bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
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
