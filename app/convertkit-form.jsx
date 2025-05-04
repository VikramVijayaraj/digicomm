"use client";

import { useState } from "react";

const ConvertKitForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-md shadow-sm max-w-lg mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Background Image */}
        <div
          className="bg-cover bg-center min-h-48 md:w-1/2"
          style={{ backgroundImage: "url('/api/placeholder/400/320')" }}
        />

        {/* Form Column */}
        <div className="p-5 md:w-1/2">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-700">
              Get our how to guide
            </h2>
          </div>

          {errorMessage && (
            <ul className="text-red-500 mb-4">
              <li>{errorMessage}</li>
            </ul>
          )}

          {isSuccess ? (
            <div className="p-4 bg-green-100 text-green-800 rounded mb-4">
              Success! Now check your email to confirm your subscription.
            </div>
          ) : (
            <div onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  className="w-full border-b border-gray-300 p-2 text-gray-600 focus:outline-none
                    focus:border-blue-500"
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-pink-300 text-white py-2 px-4 rounded font-bold hover:bg-pink-400
                  transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-pulse mr-2">●</div>
                    <div className="animate-pulse mx-2">●</div>
                    <div className="animate-pulse ml-2">●</div>
                  </div>
                ) : (
                  <span>Send me the guide</span>
                )}
              </button>
            </div>
          )}

          <div className="text-xs text-gray-500 mt-3">
            We respect your privacy. Unsubscribe at anytime.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConvertKitForm;
