import { SendHorizontal } from "lucide-react";

import FooterSubHeading from "./footer-sub-heading";
import FooterLinks from "./footer-links";
import { footerSections } from "@/lib/data";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-black text-white">
      <div
        className="global-padding py-20 text-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
          gap-y-8 lg:gap-0"
      >
        {/* Main Section */}
        <div className="flex flex-col items-center mt-5 space-y-4">
          <Link href="/">
            <img
              src="/logos/crelands.png"
              alt="Crelands Logo"
              className="object-contain w-28 h-10 lg:w-40"
            />
          </Link>
          <p>{process.env.NEXT_PUBLIC_APP_TAGLINE}</p>
          {/* <FooterSubHeading>Subscribe</FooterSubHeading>
        <p className="pb-2">Get 10% off your first order</p>
        <form
          className="flex flex-col justify-center lg:justify-start items-center border-2 w-52 lg:w-64 p-2
            rounded-sm"
        >
          <input
            className="bg-black outline-none w-full"
            type="email"
            placeholder="Enter your email"
            required
          />
          <button>
            <SendHorizontal />
          </button>
        </form> */}
        </div>

        {/* Other Sections */}
        {footerSections.map((section, index) => (
          <div key={index}>
            <FooterSubHeading>{section.sectionName}</FooterSubHeading>
            <FooterLinks links={section.sectionLinks} />
          </div>
        ))}
      </div>
      <p className="text-center pb-10 font-light">
        &copy; {currentYear} {process.env.NEXT_PUBLIC_APP_NAME}. All rights
        reserved.
      </p>
    </div>
  );
}
