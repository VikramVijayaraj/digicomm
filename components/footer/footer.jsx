import Link from "next/link";
import { FaFacebookF, FaInstagram, FaPinterestP } from "react-icons/fa6";

import FooterSubHeading from "./footer-sub-heading";
import FooterLinks from "./footer-links";
import { footerSections } from "@/lib/data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="global-padding bg-black text-white">
      <div
        className="py-20 text-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8
          lg:gap-0"
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

      <div className="pb-10 flex flex-col items-center gap-8">
        <div className="flex items-center gap-4">
          <Link
            href={"https://www.instagram.com/crelands_official/"}
            target="_blank"
          >
            <FaInstagram size={25} />
          </Link>
          <Link
            href={"https://www.facebook.com/profile.php?id=61572316867099"}
            target="_blank"
          >
            <FaFacebookF size={25} />
          </Link>
          <Link href={"https://www.pinterest.com/crelands/"} target="_blank">
            <FaPinterestP size={25} />
          </Link>
        </div>
        <p className="font-light">
          &copy; {currentYear} {process.env.NEXT_PUBLIC_APP_NAME}. All rights
          reserved.
        </p>
      </div>
    </div>
  );
}
