export default function TermsAndConditions() {
  return (
    <div className="min-h-screen pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Last updated: October 22, 2024
          </p>

          <p className="text-gray-700 mb-4">
            Welcome to {process.env.NEXT_PUBLIC_APP_NAME}! By accessing or using
            our platform at{" "}
            <a
              href="https://digicomm.vercel.app"
              className="text-blue-600 hover:underline"
            >
              https://digicomm.vercel.app
            </a>
            , you agree to be bound by these Terms and Conditions.
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                1. Use of the Platform
              </h2>
              <p className="text-gray-700 mb-2">
                You must be at least 13 years old to create an account on our
                platform. By using our services, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>
                  Provide accurate, complete information during registration.
                </li>
                <li>
                  Maintain the confidentiality of your account and password.
                </li>
                <li>
                  Not engage in any unlawful or fraudulent activity while using
                  the platform.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                2. Seller Responsibilities
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>
                  Sellers must accurately describe their digital products and
                  ensure that they own the necessary rights to sell the content.
                </li>
                <li>
                  Sellers are responsible for setting prices and handling
                  customer queries related to their products.
                </li>
                <li>
                  All digital products sold must comply with intellectual
                  property laws and must not infringe on third-party rights.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                3. Buyer Responsibilities
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>
                  Buyers must ensure they provide accurate payment information
                  and understand that all purchases are for personal,
                  non-commercial use unless otherwise specified by the seller.
                </li>
                <li>
                  Buyers are responsible for reading product descriptions and
                  ensuring they meet their needs before purchase.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                4. Payment and Fees
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>
                  {process.env.NEXT_PUBLIC_APP_NAME} charges a transaction fee
                  on each sale, which will be clearly communicated to sellers.
                </li>
                <li>
                  Payment processing is handled by third-party providers and
                  users must comply with their terms.
                </li>
                <li>
                  Any applicable taxes will be the responsibility of the user,
                  based on their location and tax regulations.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                5. Intellectual Property
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>
                  All digital content listed on the platform remains the
                  intellectual property of the respective seller.
                </li>
                <li>
                  Buyers are granted a limited license to use purchased content
                  in accordance with the seller&#39;s terms and conditions.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                6. Prohibited Activities
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>
                  You may not post or sell illegal, harmful, or fraudulent
                  products on our platform.
                </li>
                <li>
                  Users must not upload viruses, malicious code, or engage in
                  actions that harm the platform or its users.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                7. Account Termination
              </h2>
              <p className="text-gray-700">
                We reserve the right to suspend or terminate any account that
                violates these terms or engages in fraudulent activity.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                8. Limitation of Liability
              </h2>
              <p className="text-gray-700">
                We are not liable for any direct, indirect, incidental, or
                consequential damages resulting from the use or inability to use
                the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                9. Governing Law
              </h2>
              <p className="text-gray-700">
                These terms will be governed by and construed in accordance with
                the laws of India.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                10. Contact Us
              </h2>
              <p className="text-gray-700">
                If you have any questions about these Terms and Conditions,
                please contact us at{" "}
                <a
                  href="https://digicomm.vercel.app/contact"
                  className="text-blue-600 hover:underline"
                  rel="external nofollow noopener"
                  target="_blank"
                >
                  https://digicomm.vercel.app/contact
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
