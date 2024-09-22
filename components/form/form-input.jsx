export default function FormInput({
  type,
  placeholder,
  name,
  required = false,
  defaultValue = "",
}) {
  return (
    <div className="my-2">
      <input
        className="bg-gray-100 p-2 w-full"
        type={type}
        placeholder={placeholder}
        name={name}
        defaultValue={defaultValue}
        required={required}
      />
    </div>
  );
}
