import { IoSendOutline } from "react-icons/io5";

import FooterSubHeading from "./footer-sub-heading";
import FooterLinks from "./footer-links";
import { footerSections } from "@/lib/data";

export default function Footer() {
  return (
    <div className="global-padding py-20 flex justify-evenly bg-black text-white">
      {/* Main Section */}
      <div>
        <h1 className="text-3xl pb-4">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
        <FooterSubHeading>Subscribe</FooterSubHeading>
        <p className="pb-2">Get 10% off your first order</p>
        <form className="flex justify-start items-center border-2 w-64 p-2 rounded-sm">
          <input
            className="bg-black outline-none w-full"
            type="email"
            placeholder="Enter your email"
            required
          />
          <button>
            <IoSendOutline />
          </button>
        </form>
      </div>

      {/* Other Sections */}
      {footerSections.map((section, index) => (
        <div key={index}>
          <FooterSubHeading>{section.sectionName}</FooterSubHeading>
          <FooterLinks links={section.sectionLinks} />
        </div>
      ))}

      {/* Support */}
      {/* <div className="">
        <FooterSubHeading>Support</FooterSubHeading>
        <FooterLinks
          links={["Support center", "support@email.com", "Sell on Digicomm"]}
        />
      </div> */}

      {/* About */}
      {/* <div>
        <FooterSubHeading>About</FooterSubHeading>
        <FooterLinks
          links={["Privacy Policy", "Terms Of Use", "FAQ", "Contact"]}
        />
      </div> */}
    </div>
  );
}
