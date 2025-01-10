export const metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <div class="container max-w-4xl mx-auto p-4 md:px-10">
      <header class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-center text-gray-900">
          About Us
        </h1>
        <p class="text-center text-sm text-gray-500 mt-2">
          Welcome to {process.env.NEXT_PUBLIC_APP_NAME} –{" "}
          {process.env.NEXT_PUBLIC_APP_TAGLINE}
        </p>
      </header>

      <section class="bg-white p-4">
        <h2 class="text-2xl font-semibold mb-4 text-gray-900">Who We Are</h2>
        <p class="text-gray-700 mb-6">
          At {process.env.NEXT_PUBLIC_APP_NAME}, we believe in empowering
          creators by providing them with an easy-to-use platform to share,
          sell, and showcase their digital products. Whether you&#39;re an
          artist, designer, developer, or musician, our platform is built to
          help you connect with your audience and monetize your digital
          creations.
        </p>

        <h2 class="text-2xl font-semibold mb-4 text-gray-900">Our Mission</h2>
        <p class="text-gray-700 mb-6">
          Our mission is simple: to create an inclusive marketplace that
          celebrates creativity and digital craftsmanship. We want to offer an
          alternative to the traditional selling platforms by making it easier
          to get your products to market while keeping fees minimal, so creators
          can focus on what they do best – creating.
        </p>

        <h2 class="text-2xl font-semibold mb-4 text-gray-900">
          Why Choose Us?
        </h2>
        <ul class="list-disc list-inside text-gray-700 mb-6">
          <li>
            <strong>User-Friendly Platform:</strong> Our intuitive interface
            ensures that anyone, from beginners to experienced sellers, can list
            and manage products with ease.
          </li>
          <li>
            <strong>Focus on Digital Products:</strong> We specialize in digital
            goods, ensuring that creators of all kinds – from photographers to
            coders – have a dedicated space to sell their work.
          </li>
          <li>
            <strong>Low Fees:</strong> Our transparent fee structure ensures
            that creators keep more of what they earn.
          </li>
          <li>
            <strong>Community Driven:</strong> We aim to build a supportive
            community where creators can learn from each other and grow
            together.
          </li>
          <li>
            <strong>Secure Transactions:</strong> We use trusted payment
            providers and robust security measures to ensure safe and smooth
            transactions.
          </li>
        </ul>

        <h2 class="text-2xl font-semibold mb-4 text-gray-900">How It Works</h2>
        <p class="text-gray-700 mb-6">
          Getting started on {process.env.NEXT_PUBLIC_APP_NAME} is easy:
        </p>
        <ul class="list-decimal list-inside text-gray-700 mb-6">
          <li>Create an account in minutes.</li>
          <li>Set up your store with your brand.</li>
          <li>
            Upload your digital products – whether it&#39;s an ebook, design,
            software, or music file.
          </li>
          <li>
            Sell directly to your audience and get paid instantly through secure
            payment gateways.
          </li>
        </ul>

        <h2 class="text-2xl font-semibold mb-4 text-gray-900">
          Join Our Community
        </h2>
        <p class="text-gray-700 mb-6">
          {process.env.NEXT_PUBLIC_APP_NAME} is more than just a marketplace –
          it&#39;s a community of creators and buyers who share a passion for
          digital products. Whether you want to sell your latest digital product
          or discover unique creations from others, you&#39;re in the right
          place.
        </p>

        <p class="text-gray-700">
          Join us today and start your journey with{" "}
          {process.env.NEXT_PUBLIC_APP_NAME}! Feel free to reach out to us
          anytime at{" "}
          <a
            href="https://www.crelands.com/contact-us"
            className="text-blue-600 hover:underline"
          >
            https://www.crelands.com/contact-us
          </a>{" "}
          with any questions or feedback.
        </p>
      </section>
    </div>
  );
}
