import { notFound } from "next/navigation";

export default function CancellationAndRefundPolicy() {
  return notFound();

  return (
    <div className="min-h-screen pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Cancellation and Refund Policy
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Last updated: October 22, 2024
          </p>

          <p className="text-gray-700 mb-6">
            At {process.env.NEXT_PUBLIC_APP_NAME}, we strive to ensure a
            seamless experience for both buyers and sellers. Due to the nature
            of digital products, we have specific guidelines for cancellations
            and refunds.
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                1. Cancellation Policy
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <strong>Buyers:</strong> Once a digital product has been
                  purchased and downloaded, the transaction is considered final.
                  Cancellations are only allowed if the product has not been
                  accessed or downloaded.
                </li>
                <li>
                  <strong>Sellers:</strong> Sellers can remove products from the
                  platform at any time, but any active transactions before
                  removal will still be completed.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                2. Refund Policy
              </h2>
              <p className="text-gray-700 mb-2">
                Due to the non-returnable nature of digital products, refunds
                will only be issued under the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                <li>The digital file is corrupted or inaccessible.</li>
                <li>
                  The product received is not as described in the listing
                  (subject to investigation by our team).
                </li>
                <li>
                  Unauthorized charges or fraudulent activity, in which case our
                  team will investigate.
                </li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How to Request a Refund:
              </h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>
                  Buyers can request a refund by contacting our support team at{" "}
                  <a
                    href="https://digicomm.vercel.app/contact"
                    className="text-blue-600 hover:underline"
                  >
                    https://digicomm.vercel.app/contact
                  </a>{" "}
                  within 7 days of purchase.
                </li>
                <li>
                  Refund requests must include the order number, product
                  details, and a description of the issue.
                </li>
                <li>
                  Refunds will be processed through the original payment method
                  within 7 days of approval.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                3. Exceptions
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>
                  Refunds will not be provided for cases of buyer&#39;s remorse
                  or for failure to understand the product&#39;s use.
                </li>
                <li>
                  Custom or personalized digital products are non-refundable
                  unless they fail to meet the description or quality standard.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                4. Contact Us
              </h2>
              <p className="text-gray-700">
                If you have any questions about cancellations or refunds, please
                contact our support team at{" "}
                <a
                  href="https://digicomm.vercel.app/contact"
                  className="text-blue-600 hover:underline"
                >
                  https://digicomm.vercel.app/contact
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
