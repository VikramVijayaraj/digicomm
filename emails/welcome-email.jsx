import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  pixelBasedPreset,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

export default function WelcomeEmail() {
  const links = [
    {
      title: "Visit our blog",
      href: "https://www.crelands.com/blog",
    },
    { title: "About us", href: "https://www.crelands.com/about-us" },
    { title: "Contact us", href: "https://www.crelands.com/contact-us" },
  ];

  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: "#FB201A",
                offwhite: "#fafbfb",
              },
              spacing: {
                0: "0px",
                20: "20px",
                45: "45px",
              },
            },
          },
        }}
      >
        <Preview>Crelands Welcome</Preview>
        <Body className="bg-offwhite font-sans text-base">
          <Img
            src="https://firebasestorage.googleapis.com/v0/b/digicomm-cbe9b.appspot.com/o/crelands.png?alt=media&token=6ae87e0d-2600-41ee-8d91-e2b2696b44ed"
            width="160"
            height="40"
            alt="Crelands Logo"
            className="mx-auto my-20"
          />
          <Container className="bg-white p-45">
            <Heading className="my-0 text-center leading-8">
              Welcome to Crelands
            </Heading>

            <Section>
              <Row>
                <Text className="text-base">
                  Congratulations! You’ve joined a growing community of
                  creators, entrepreneurs, and innovators who use Crelands to
                  showcase, sell, and grow their work — without limits.
                </Text>

                <Text className="text-base">Here's how to get started:</Text>
              </Row>
            </Section>

            <ul>
              <li className="mb-20">
                <strong>Set up your store.</strong> Start and customize your{" "}
                <Link href="https://www.crelands.com/your/shop/dashboard">
                  storefront
                </Link>{" "}
                by adding your brand name, logo, and description that tell your
                story.
              </li>

              <li className="mb-20">
                <strong>List your first product.</strong>{" "}
                <Link href="https://www.crelands.com/your/shop/dashboard/products/new-product">
                  Upload your digital product
                </Link>
                , add an engaging title, and set your price.
              </li>

              <li className="mb-20">
                <strong>Share your store link.</strong> Promote your store on
                social media, in your bio, or anywhere your audience can find
                you.
              </li>
            </ul>

            <Section className="text-center">
              <Button
                href="https://www.crelands.com/your/shop/dashboard"
                className="rounded-lg bg-brand px-[18px] py-3 text-white"
              >
                Go to your dashboard
              </Button>
            </Section>

            <Section className="mt-45">
              <Row>
                {links.map((link) => (
                  <Column key={link.title}>
                    <Link
                      className="font-bold text-black underline"
                      href={link.href}
                    >
                      {link.title}
                    </Link>{" "}
                    <span className="text-red-500">→</span>
                  </Column>
                ))}
              </Row>
            </Section>
          </Container>

          <Container className="mt-20">
            <Text className="mb-45 text-center text-gray-400">
              You&apos;re in control. No commission. No monthly fees. Just your
              creativity unlocked.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
