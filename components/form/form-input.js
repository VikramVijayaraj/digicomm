export default function FormInput({ type, placeholder, name }) {
  return (
    <div className="my-2">
      <input
        className="bg-gray-100 p-2 w-2/3"
        type={type}
        placeholder={placeholder}
        name={name}
      />
    </div>
  );
}
