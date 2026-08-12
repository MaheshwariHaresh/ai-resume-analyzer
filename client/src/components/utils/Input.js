const Input = ({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
}) => (
  <div>
    <label className="font-medium mb-2 block">{label}</label>

    <div
      className={`flex items-center border rounded-xl px-4 ${
        disabled ? "bg-gray-50" : ""
      }`}
    >
      <div className="text-gray-500">{icon}</div>

      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full p-3 outline-none bg-transparent disabled:text-gray-500"
      />
    </div>
  </div>
);

export default Input;
