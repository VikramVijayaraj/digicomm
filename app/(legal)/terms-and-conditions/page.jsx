import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions",
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Terms and Conditions
        </h1>
        <p className="text-gray-700 mb-4">
          <strong>Last updated:</strong> November 28, 2024
        </p>
        <div className="space-y-6 text-gray-700">
          <p>
            Welcome to Crelands! These Terms and Conditions (&quot;Terms&quot;)
            govern your use of our website,{" "}
            <a href="https://crelands.com">
              <strong>https://crelands.com</strong>
            </a>{" "}
            (&quot;Website&quot;), and the services we provide through our
            digital products marketplace for creators. By accessing or using the
            Website, you agree to comply with these Terms.
          </p>
          <p>
            If you do not agree with these Terms, please do not use our Website.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">
            1. Definitions
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>
                &quot;We,&quot; &quot;Us,&quot; or &quot;Our&quot;
              </strong>{" "}
              refers to Crelands, the owner and operator of the Website.
            </li>
            <li>
              <strong>
                &quot;User,&quot; &quot;You,&quot; or &quot;Your&quot;
              </strong>{" "}
              refers to anyone accessing or using the Website, including buyers
              and sellers.
            </li>
            <li>
              <strong>&quot;Seller&quot;</strong> refers to creators who list
              and sell digital products on the Website.
            </li>
            <li>
              <strong>&quot;Buyer&quot;</strong> refers to individuals
              purchasing digital products through the Website.
            </li>
            <li>
              <strong>&quot;Content&quot;</strong> refers to any digital
              products, text, images, or other materials uploaded, shared, or
              sold on the Website.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">
            2. Eligibility
          </h2>
          <p>
            You must be at least 18 years old to use the Website. By accessing
            or using our services, you represent and warrant that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              You are legally capable of entering into a binding contract.
            </li>
            <li>
              All information provided by you is accurate, complete, and
              current.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">
            3. Account Registration
          </h2>
          <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">
            a. Account Creation
          </h3>
          <p>
            To access certain features of the Website, such as buying or selling
            digital products, you must create an account. You are responsible
            for maintaining the confidentiality of your account credentials and
            for all activities under your account.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">
            b. Account Termination
          </h3>
          <p>
            We reserve the right to suspend or terminate your account at our
            discretion for any violation of these Terms or applicable laws.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">
            4. Use of the Website
          </h2>
          <p>
            You agree to use the Website only for lawful purposes and in
            compliance with these Terms. Prohibited activities include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Using the Website to distribute harmful or malicious software.
            </li>
            <li>Misrepresenting your identity or affiliation.</li>
            <li>Infringing on the intellectual property rights of others.</li>
            <li>Circumventing security measures on the Website.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">
            5. Sellers and Listings
          </h2>
          <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">
            a. Responsibilities of Sellers
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Sellers must ensure all digital products listed on the Website are
              original, lawful, and do not infringe on third-party rights.
            </li>
            <li>
              Sellers are solely responsible for the accuracy of product
              descriptions and compliance with applicable laws.
            </li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">
            b. Prohibited Listings
          </h3>
          <p>The following types of content are prohibited:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Illegal or fraudulent products.</li>
            <li>Content that promotes violence, hate, or discrimination.</li>
            <li>Content containing malware, viruses, or harmful code.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">
            6. Purchases and Payments
          </h2>
          <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">
            a. Buyer Responsibilities
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Buyers must carefully review product descriptions before
              purchasing.
            </li>
            <li>
              All sales are final unless otherwise stated in the seller’s refund
              policy.
            </li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">
            b. Payment Processing
          </h3>
          <p>
            Payments are processed through secure third-party payment gateways.
            We are not responsible for errors or disputes arising from payment
            processing.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">
            7. Intellectual Property
          </h2>
          <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">
            a. Ownership of Content
          </h3>
          <p>
            Sellers retain ownership of their digital products. By listing
            products on the Website, sellers grant us a non-exclusive license to
            display, market, and sell their products.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">
            b. Crelands Intellectual Property
          </h3>
          <p>
            All content on the Website, excluding user-generated content, is
            owned by Crelands or licensed to us. Unauthorized use of our content
            is prohibited.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">
            8. Limitation of Liability
          </h2>
          <p>To the fullest extent permitted by law:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Crelands is not liable for indirect, incidental, or consequential
              damages arising from your use of the Website.
            </li>
            <li>
              We do not guarantee uninterrupted or error-free access to the
              Website.
            </li>
            <li>
              Crelands is not responsible for disputes between buyers and
              sellers.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">
            9. Indemnification
          </h2>
          <p>
            You agree to indemnify and hold harmless Crelands, its officers,
            employees, and affiliates from any claims, damages, or losses
            arising out of:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your violation of these Terms.</li>
            <li>Your use of the Website.</li>
            <li>Your infringement of third-party rights.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">
            10. Privacy
          </h2>
          <p>
            Your use of the Website is subject to our{" "}
            <Link href="/privacy-policy">
              <strong>Privacy Policy</strong>
            </Link>
            . Please review it to understand how we collect, use, and protect
            your personal data.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">
            11. Termination
          </h2>
          <p>
            We may suspend or terminate your access to the Website at our sole
            discretion for any reason, including violation of these Terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">
            12. Governing Law
          </h2>
          <p>
            These Terms are governed by the laws of India, without regard to
            conflict of law principles. Any disputes shall be subject to the
            exclusive jurisdiction of the courts located in Trichy, Tamil Nadu,
            India.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">
            13. Changes to These Terms
          </h2>
          <p>
            We reserve the right to update or modify these Terms at any time.
            Changes will be posted on this page with the updated effective date.
            Your continued use of the Website constitutes acceptance of the
            revised Terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">
            14. Contact Us
          </h2>
          <p>
            If you have questions or concerns about these Terms, please contact
            us:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Business Name:</strong> Crelands
            </li>
            <li>
              <strong>Email:</strong> contact@crelands.com
            </li>
            <li>
              <strong>Address:</strong> 7/221, No 2 JS Garden, Therkku
              chattiram, Mela valadi POST, Lalgudi TALUK, Tiruchirappalli, Tamil
              Nadu, PIN: 621218
            </li>
          </ul>

          <p>
            By using Crelands, you acknowledge that you have read, understood,
            and agreed to these Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
