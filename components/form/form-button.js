export default function FormButton({ children }) {
  return (
    <div className="bg-primary text-white p-4 text-center rounded-sm cursor-pointer hover:bg-primary-dark">
      <button>{children}</button>
    </div>
  );
}
