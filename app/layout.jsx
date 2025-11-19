import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import "@/styles/_variables.scss";
import "@/styles/_keyframe-animations.scss";
import { poppins } from "@/lib/fonts";
import { ReduxProvider } from "./redux-provider";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { Toaster } from "@/components/ui/sonner";
import FacebookPixel from "@/components/FacebookPixel";
import ReportAnIssueButton from "@/components/cta/report-an-issue-button";
import DiscordInviteBanner from "@/components/cta/discord-invite-banner";

export const metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000",
  ),
  title: {
    default: process.env.NEXT_PUBLIC_APP_NAME,
    template: "%s | " + process.env.NEXT_PUBLIC_APP_NAME,
  },
  description:
    "Buy and sell digital and physical products with ease on Crelands — India’s go-to marketplace for creators, designers, developers, and entrepreneurs.",
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-WRHHRN09L9"
        ></Script>
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-WRHHRN09L9');
          `}
        </Script>

        {/* Microsoft Clarity: use Next.js Script to run after the page is interactive */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "u1erxceaxm");`}
        </Script>

        {/* Facebook Domain Verification */}
        <meta
          name="facebook-domain-verification"
          content="reqlxzifjs2ql6zst9fod7o2t53mzh"
        />
      </head>
      <body className="font-poppins">
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <div className="py-8">{children}</div>
            <Toaster richColors />

            <div className="global-padding">
              <DiscordInviteBanner />
            </div>
            <Footer />
          </ThemeProvider>
        </ReduxProvider>

        {/* Vercel's Speed Insights */}
        <SpeedInsights />

        <FacebookPixel />

        {/* Fixed button */}
        <ReportAnIssueButton />
      </body>
    </html>
  );
}
