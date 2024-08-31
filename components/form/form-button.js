export default function FormButton({ children }) {
  return (
    <button className="bg-primary text-white p-3 text-center w-full text-xl rounded-sm cursor-pointer hover:bg-primary-dark">
      {children}
    </button>
  );
}
