import { SendHorizontal } from "lucide-react";

import FooterSubHeading from "./footer-sub-heading";
import FooterLinks from "./footer-links";
import { footerSections } from "@/lib/data";

export default function Footer() {
  return (
    <div
      className="global-padding py-20 text-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
        gap-y-8 lg:gap-0 bg-black text-white"
    >
      {/* Main Section */}
      <div>
        <h1 className="text-3xl pb-4">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
        <p>Aliqua qui amet ex dolore occaecat sint.</p>
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
  );
}
