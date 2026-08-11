import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import { ArrowUpRight, QrCode } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

import { Button } from "@/components/ui/button";

const WHATSAPP_INVITE_URL = "https://wa.me/message/D6W6LVXULB74N1";

export default async function WhatsAppSupportBanner() {
  const qrCodeDataUrl = await QRCode.toDataURL(WHATSAPP_INVITE_URL, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 280,
    color: {
      dark: "#10221A",
      light: "#FFFFFF",
    },
  });

  return (
    <section
      aria-labelledby="whatsapp-support-heading"
      className="global-padding"
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-[#10221A] px-6 py-8 shadow-[0_24px_70px_rgba(16,34,26,0.18)] sm:px-10 sm:py-10 lg:px-14 lg:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(37,211,102,0.23),transparent_30%),radial-gradient(circle_at_92%_100%,rgba(255,255,255,0.08),transparent_25%)]" />
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full border border-[#25D366]/20" />
        <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border border-white/10" />

        <div className="relative grid items-center gap-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] text-[#10221A]">
                <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
              </span>
              Crelands support on WhatsApp
            </div>

            <h2
              id="whatsapp-support-heading"
              className="mt-6 max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              Chat with us on WhatsApp.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-emerald-50/75 sm:text-lg">
              Send a message for help with buying, selling, orders, or
              anything else on the marketplace.
            </p>

            <Button
              asChild
              size="lg"
              className="group mt-8 h-14 rounded-2xl bg-[#25D366] px-6 text-base font-semibold text-[#10221A] shadow-lg shadow-[#25D366]/15 transition-transform hover:scale-[1.02] hover:bg-[#53E489]"
            >
              <Link
                href={WHATSAPP_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="mr-2 h-5 w-5" aria-hidden="true" />
                Send a WhatsApp message
                <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>

            {/* <p className="mt-4 text-sm text-emerald-50/55">
              Opens WhatsApp securely in a new tab.
            </p> */}
          </div>

          <div className="mx-auto w-full max-w-[260px] rounded-[1.75rem] bg-white p-4 shadow-2xl shadow-black/20 sm:p-5 lg:mx-0">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8FAEF] text-[#128C4A]">
                <QrCode className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Scan to chat
                </p>
                {/* <p className="text-xs text-slate-500">Open with your camera</p> */}
              </div>
            </div>

            <Image
              src={qrCodeDataUrl}
              alt="QR code for messaging Crelands on WhatsApp"
              width={280}
              height={280}
              unoptimized
              className="mt-4 w-full rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
