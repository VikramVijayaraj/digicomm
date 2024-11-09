export default function Newsletter() {
  return (
    <div className="global-padding bg-sky-200 py-10 flex flex-col items-center space-y-4">
      <p className="text-center font-semibold">
        Subscibe to get exclusive offers, and personalised tips for shopping and
        selling on {process.env.NEXT_PUBLIC_APP_NAME}.
      </p>

      {/* User Input */}
      <form className="flex w-full md:justify-center">
        <input
          className="w-full md:w-96 p-4 rounded-l-full bg-white"
          type="email"
          placeholder="Enter your email"
          required
        />
        <button className="bg-white p-4 rounded-r-full hover:bg-black hover:text-white">
          Subscribe
        </button>
      </form>
    </div>
  );
}
