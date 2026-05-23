import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa6";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const userAvatars = [
  "/images/community/1.webp",
  "/images/community/2.webp",
  "/images/community/3.webp",
  "/images/community/4.webp",
  "/images/community/5.webp",
  "/images/community/6.webp",
];

export default function DiscordInviteBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B0F19] mb-16">
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(88,101,242,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_28%)]" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Blur Orbs */}
      <div className="absolute -top-20 left-10 h-56 w-56 rounded-full bg-[#5865F2]/20 blur-3xl" />
      <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-10 px-6 py-10 md:px-10 md:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-14">
        {/* Left Content */}
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5865F2]/20 text-[#8EA1FF]">
              <FaDiscord className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium tracking-wide text-zinc-300">
              CRELANDS COMMUNITY
            </span>
          </div>

          <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
            Build, Learn & Grow With
            <span className="bg-gradient-to-r from-[#8EA1FF] via-[#C4B5FD] to-[#57F287] bg-clip-text text-transparent">
              {" "}
              Creators Like You
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400 md:text-lg">
            Join the Crelands Discord community to connect with designers,
            developers, musicians, and digital creators. Share your work,
            discover opportunities, get feedback, and grow together.
          </p>

          {/* Social Proof */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <div className="flex -space-x-3">
              {userAvatars.map((avatar, index) => (
                <Image
                  key={index}
                  src={avatar}
                  alt={`Community member ${index + 1}`}
                  width={48}
                  height={48}
                  unoptimized
                  className="h-11 w-11 rounded-full border-2 border-[#0B0F19] object-cover shadow-lg"
                  style={{ zIndex: userAvatars.length - index }}
                />
              ))}
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Growing community
              </p>
              <p className="text-sm text-zinc-500">
                More creators joining every day
              </p>
            </div>
          </div>
        </div>

        {/* Right CTA Card */}
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] to-transparent" />

          <div className="relative z-10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                  Join The Server
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  Crelands Discord
                </h3>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5865F2] to-[#7289DA] shadow-lg shadow-[#5865F2]/30">
                <FaDiscord className="h-7 w-7 text-white" />
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/5 bg-black/20 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Channels</span>
                <span className="font-medium text-white">
                  Welcome • Support
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Community</span>
                <span className="font-medium text-[#57F287]">
                  Online & Active
                </span>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className="group mt-6 h-14 w-full rounded-2xl bg-gradient-to-r from-[#5865F2] to-[#7289DA] text-base font-semibold text-white shadow-xl shadow-[#5865F2]/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-[#5865F2]/40"
            >
              <Link
                href="https://discord.gg/nJE8Kf9GWJ"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                Join Discord Server
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>

            <p className="mt-4 text-center text-xs text-zinc-500">
              Free to join • Open for all creators
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
