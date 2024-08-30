export default function FormInput({ type, placeholder }) {
  return (
    <div className="my-2">
      <input className="bg-gray-100 p-2 w-1/3" type={type} placeholder={placeholder} />
    </div>
  );
}
