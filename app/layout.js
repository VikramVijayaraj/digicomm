import "./globals.css";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";

export const metadata = {
  title: "DigiComm",
  description: "An e-commerce platform for digital-only products.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="py-10">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
