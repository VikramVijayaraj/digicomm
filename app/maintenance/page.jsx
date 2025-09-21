// app/maintenance/page.tsx (Next.js App Router)
// If you’re using Pages Router, save it as pages/maintenance.tsx

import Image from "next/image";
import Link from "next/link";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 text-center">
      <div className="max-w-lg">
        {/* Illustration */}
        <div className="mb-6">
          <div className="mb-6">
            <img
              src="/images/maintenance.svg" // file inside public/
              alt="Maintenance illustration"
              className="mx-auto w-80 h-auto"
            />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Good things are on the way!
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          Hi there, we&apos;re upgrading our systems to deliver stronger
          security and a smoother, enhanced experience for you.”
          <br />
          We&apos;ll be back online very soon!
        </p>

        {/* CTA */}
        {/* <Link
          href="/"
          className="inline-block px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition"
        >
          Back to Home
        </Link> */}

        {/* Small footer note */}
        <p className="mt-6 text-sm text-gray-400">
          Thank you for your patience ❤️
        </p>
      </div>
    </div>
  );
}
