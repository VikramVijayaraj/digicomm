"use client";

/*
  Crelands — Loading component
  ─────────────────────────────
  Fix: each card's SVG viewBox is padded by the exact amount its rotation
  spills beyond the unrotated bounding box, so no corner is ever clipped.

  Padding per card (calculated from rotation angle):
    Planner  80×102  −7°  → viewBox="-6 -5 92 112"   (pad 6x, 5y)
    Ebook    72×96   +6°  → viewBox="-5 -4 82 104"   (pad 5x, 4y)
    Font     80×58   −3°  → viewBox="-2 -3 84 64"    (pad 2x, 3y)
*/

const STYLE = `
  @keyframes cl-deal {
    from { opacity: 0; transform: translateY(26px) scale(0.93); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  @keyframes cl-float {
    0%, 100% { transform: translateY(0px);  }
    50%       { transform: translateY(-5px); }
  }
  @keyframes cl-fadeup {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0);   }
  }
  @keyframes cl-pulse {
    0%, 100% { transform: scale(1);    opacity: 1;   }
    50%       { transform: scale(1.6); opacity: 0.5; }
  }

  .cl-card {
    position: absolute;
    opacity: 0;
    animation:
      cl-deal  0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
      cl-float 3.8s  ease-in-out                        infinite;
  }
  .cl-card:nth-child(1) { animation-delay: 0.10s, 0.80s; animation-duration: 0.55s, 4.0s; }
  .cl-card:nth-child(2) { animation-delay: 0.28s, 0.95s; animation-duration: 0.55s, 3.6s; }
  .cl-card:nth-child(3) { animation-delay: 0.46s, 1.10s; animation-duration: 0.55s, 3.2s; }

  .cl-wordmark {
    opacity: 0;
    animation: cl-fadeup 0.5s ease forwards 0.70s;
  }
  .cl-dots {
    opacity: 0;
    animation: cl-fadeup 0.4s ease forwards 0.88s;
  }
  .cl-dot { animation: cl-pulse 1.4s ease-in-out infinite; }
  .cl-dot:nth-child(1) { animation-delay: 0.00s; }
  .cl-dot:nth-child(2) { animation-delay: 0.22s; }
  .cl-dot:nth-child(3) { animation-delay: 0.44s; }
`;

/*
  Planner card — tall portrait, −7°, left anchor.
  viewBox padded: "-6 -5 92 112" (card is 80×102, rotation needs +6px/+5px each side).
  Positioned: left=0, top=26.
*/
function PlannerCard() {
  return (
    <svg
      className="cl-card"
      style={{ left: 0, top: 26 }}
      viewBox="-6 -5 92 112"
      width="92"
      height="112"
      fill="none"
      aria-hidden="true"
    >
      <g transform="rotate(-7, 40, 51)">
        <rect
          x="1.25"
          y="1.25"
          width="77.5"
          height="99.5"
          rx="8"
          fill="#FFFDF9"
          stroke="#1A1410"
          strokeWidth="2"
        />
        <rect
          x="1.25"
          y="1.25"
          width="77.5"
          height="22"
          rx="8"
          fill="#FFB347"
          stroke="#1A1410"
          strokeWidth="2"
        />
        <line
          x1="10"
          y1="37"
          x2="70"
          y2="37"
          stroke="#1A1410"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.5"
        />
        <line
          x1="10"
          y1="49"
          x2="58"
          y2="49"
          stroke="#1A1410"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.35"
        />
        <line
          x1="10"
          y1="61"
          x2="63"
          y2="61"
          stroke="#1A1410"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.35"
        />
        <rect
          x="10"
          y="72"
          width="14"
          height="14"
          rx="3.5"
          stroke="#E8321A"
          strokeWidth="2"
        />
        <path
          d="M13 79l3 3 5.5-6"
          stroke="#E8321A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="30"
          y1="79"
          x2="64"
          y2="79"
          stroke="#1A1410"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.35"
        />
      </g>
    </svg>
  );
}

/*
  Ebook cover — tall portrait, +6°, centre overlap.
  viewBox padded: "-5 -4 82 104" (card is 72×96, rotation needs +5px/+4px each side).
  Positioned: left=62, top=0.
*/
function EbookCard() {
  return (
    <svg
      className="cl-card"
      style={{ left: 62, top: 0 }}
      viewBox="-5 -4 82 104"
      width="82"
      height="104"
      fill="none"
      aria-hidden="true"
    >
      <g transform="rotate(6, 36, 48)">
        <rect
          x="1.25"
          y="1.25"
          width="69.5"
          height="93.5"
          rx="7"
          fill="#FFE3C2"
          stroke="#1A1410"
          strokeWidth="2"
        />
        <rect
          x="7"
          y="7"
          width="58"
          height="38"
          rx="3"
          fill="#1A1410"
          opacity="0.85"
        />
        <path
          d="M14 36l9-12 8 8 7-10 12 14"
          stroke="#FFB347"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="7"
          y1="54"
          x2="65"
          y2="54"
          stroke="#1A1410"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.5"
        />
        <line
          x1="7"
          y1="65"
          x2="48"
          y2="65"
          stroke="#1A1410"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.35"
        />
        <line
          x1="7"
          y1="76"
          x2="56"
          y2="76"
          stroke="#1A1410"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.35"
        />
      </g>
    </svg>
  );
}

/*
  Font / "Aa" card — small landscape, −3°, lower right.
  viewBox padded: "-2 -3 84 64" (card is 80×58, rotation needs +2px/+3px each side).
  Positioned: left=122, top=98.
*/
function FontCard() {
  return (
    <svg
      className="cl-card"
      style={{ left: 122, top: 98 }}
      viewBox="-2 -3 84 64"
      width="84"
      height="64"
      fill="none"
      aria-hidden="true"
    >
      <g transform="rotate(-3, 40, 29)">
        <rect
          x="1.25"
          y="1.25"
          width="77.5"
          height="55.5"
          rx="8"
          fill="#FFFDF9"
          stroke="#1A1410"
          strokeWidth="2"
        />
        <text
          x="10"
          y="38"
          fontFamily="Georgia, serif"
          fontSize="28"
          fill="#E8321A"
          fontStyle="italic"
        >
          Aa
        </text>
        <line
          x1="10"
          y1="45"
          x2="68"
          y2="45"
          stroke="#1A1410"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.3"
        />
      </g>
    </svg>
  );
}

export default function Loading() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />

      <div className="h-[100dvh] w-full flex flex-col items-center justify-center pb-[12vh]">
        {/* ── Card cluster ── */}
        <div
          className="relative"
          style={{ width: 230, height: 210 }}
          aria-hidden="true"
        >
          <PlannerCard />
          <EbookCard />
          <FontCard />

          {/* Sparkle — top right */}
          <svg
            style={{ position: "absolute", right: -2, top: 8 }}
            width="20"
            height="20"
            viewBox="0 0 22 22"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M11 1l2.5 7.5L21 11l-7.5 2.5L11 21l-2.5-7.5L1 11l7.5-2.5z"
              fill="#E8321A"
              opacity="0.82"
            />
          </svg>

          {/* Amber dot — top left */}
          <svg
            style={{ position: "absolute", left: 4, top: 12 }}
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="4" cy="4" r="4" fill="#FFB347" />
          </svg>
        </div>

        {/* ── Wordmark ── */}
        {/* <p
          className="cl-wordmark mt-7 text-[26px] text-[#1A1410] tracking-tight"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
          }}
        >
          Crelands
        </p> */}

        {/* ── Progress dots ── */}
        <div
          className="cl-dots flex items-center gap-[7px] mt-5"
          role="status"
          aria-label="Loading"
        >
          <span className="cl-dot block w-[7px] h-[7px] rounded-full bg-[#E8321A]" />
          <span className="cl-dot block w-[7px] h-[7px] rounded-full bg-[#FFB347]" />
          <span className="cl-dot block w-[7px] h-[7px] rounded-full bg-[#E8321A] opacity-45" />
          <span className="sr-only">Loading…</span>
        </div>
      </div>
    </>
  );
}
