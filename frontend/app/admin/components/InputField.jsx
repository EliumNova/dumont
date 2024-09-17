export default function InputField({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  order = { flex: 0, grid: 0 },
}) {
  // Si `order` es un objeto con `flex` y `grid`, aplicamos esos valores en línea
  const flexOrder = order.flex !== undefined ? order.flex : 0;
  const gridOrder = order.grid !== undefined ? order.grid : 0;

  return (
    <div
      style={{ order: flexOrder }} // Aplica el orden en línea para Flexbox
      className={`flex flex-col gap-3 w-full lg:w-[32rem] p-4 my-2 ${
        gridOrder !== 0 ? `xl:order-${gridOrder}` : ""
      }`}
    >
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
        className="bg-[#E2E5E5] h-14 rounded-lg p-4 text-base"
      />
    </div>
  );
}
