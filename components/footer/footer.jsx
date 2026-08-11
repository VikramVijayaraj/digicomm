import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaPinterestP,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";

import { footerSections } from "@/lib/data";

const sectionHeadings = ["Company", "Marketplace", "Policies"];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61572316867099",
    icon: FaFacebookF,
  },
  {
    label: "Pinterest",
    href: "https://www.pinterest.com/crelands/",
    icon: FaPinterestP,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/crelands_official/",
    icon: FaInstagram,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@crelands/shorts",
    icon: FaYoutube,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/crelands/",
    icon: FaLinkedin,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] text-white">
      <div className="global-padding">
        <div className="grid gap-x-8 gap-y-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:py-16">
          <div className="sm:col-span-2 lg:col-span-3">
            <Link href="/" className="inline-block">
              <img
                src="/logos/crelands.png"
                alt="Crelands"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/60">
              {process.env.NEXT_PUBLIC_APP_TAGLINE ||
                "A creative marketplace for digital products."}
            </p>
          </div>

          {footerSections.map((section, index) => (
            <nav
              key={sectionHeadings[index]}
              aria-label={sectionHeadings[index]}
              className="lg:col-span-2"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                {sectionHeadings[index]}
              </p>
              <ul className="mt-4 space-y-3">
                {section.sectionLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.link}
                      className="text-sm text-white/75 transition-colors hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              Support
            </p>
            <Link
              href="https://wa.me/message/D6W6LVXULB74N1"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 block rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-[#25D366]/40 hover:bg-[#25D366]/10"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-[#10221A]">
                  <FaWhatsapp className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Chat on WhatsApp
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-white/55">
                    Get quick help from Crelands.
                  </p>
                </div>
              </div>
              <span className="mt-4 inline-block text-sm font-medium text-[#53E489] transition-transform group-hover:translate-x-0.5">
                Send us a message →
              </span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/50">
            © {currentYear} {process.env.NEXT_PUBLIC_APP_NAME || "Crelands"}.
            All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
