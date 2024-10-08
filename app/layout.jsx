import "./globals.css";
import { ReduxProvider } from "./redux-provider";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "DigiComm",
  description: "An e-commerce platform for digital-only products.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <div className="py-10">{children}</div>
            <Toaster richColors />
            <Footer />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
