export default function Newsletter() {
  return (
    <div className="bg-sky-200 py-10 flex flex-col items-center space-y-4">
      <p>
        Subscibe to get exclusive offers, and personalised tips for shopping and
        selling on {process.env.NEXT_PUBLIC_APP_NAME}.
      </p>

      {/* User Input */}
      <form>
        <input
          className="w-96 p-4 rounded-l-full bg-white"
          type="email"
          placeholder="Enter your email"
          required
        />
        <button className="bg-white p-4 rounded-r-full hover:bg-black hover:text-white">
          Subscibe
        </button>
      </form>
    </div>
  );
}