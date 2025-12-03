// import { BadgePercent, IndianRupee, Store } from "lucide-react";
// import SectionLayout from "./section-layout";

import { Percent, Store, IndianRupee } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <div className="global-padding w-full flex items-center justify-center font-sans">
      {/* Main Card Container */}
      <div className="w-full rounded-3xl bg-gradient-to-b lg:bg-gradient-to-r from-secondary-brand to-white p-8 md:p-12 shadow-xl text-center">
        {/* Header Section */}
        <h2 className="mb-12 text-3xl md:text-4xl font-black text-gray-800 tracking-wide leading-tight drop-shadow-sm">
          Why Choose Crelands?
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Feature 1: Zero Commission */}
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-brand text-white shadow-lg">
              <Percent size={40} strokeWidth={2.5} />
            </div>
            <h3 className="mb-2 text-lg font-extrabold text-gray-900 uppercase tracking-tight">
              Zero
              <br />
              Commission
            </h3>
            <p className="text-sm font-medium text-gray-800 leading-snug px-4">
              Keep 100% of
              <br />
              your earnings.
            </p>
          </div>

          {/* Feature 2: Instant Store Setup */}
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-brand text-white shadow-lg">
              <Store size={40} strokeWidth={2.5} />
            </div>
            <h3 className="mb-2 text-lg font-extrabold text-gray-900 uppercase tracking-tight">
              Instant
              <br />
              Store Setup
            </h3>
            <p className="text-sm font-medium text-gray-800 leading-snug px-2">
              Sell digital products
              <br />
              in minutes.
            </p>
          </div>

          {/* Feature 3: Made For India */}
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-brand text-white shadow-lg">
              {/* Using Indian Rupee symbol */}
              <IndianRupee size={40} strokeWidth={2.5} />
            </div>
            <h3 className="mb-2 text-lg font-extrabold text-gray-900 uppercase tracking-tight">
              Made For
              <br />
              India
            </h3>
            <p className="text-sm font-medium text-gray-800 leading-snug px-2">
              Local payments &<br />
              audience reach.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default function WhyChooseUs() {
//   return (
//     <section className="global-padding">
//       <SectionLayout heading="Why creators choose Crelands">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
//           <Card
//             title="Zero Commission"
//             desc="Keep 100% of your earnings with no hidden fees or subscriptions."
//           >
//             <BadgePercent className="text-primary-brand" />
//           </Card>

//           <Card
//             title="Instant Store Setup"
//             desc="Start selling digital products in minutes, without any tech skills."
//           >
//             <Store className="text-primary-brand" />
//           </Card>

//           <Card
//             title="Made for India"
//             desc=" Local payments, and audience reach for India's growing creator economy."
//           >
//             <IndianRupee className="text-primary-brand" />
//           </Card>
//         </div>
//       </SectionLayout>
//     </section>
//   );
// }

// function Card({ children, title, desc }) {
//   return (
//     <div
//       className="bg-secondary p-8 rounded-xl space-y-4 border hover:scale-105
//         transition-transform"
//     >
//       {children}
//       <div className="space-y-1">
//         <p className="text-lg font-bold">{title}</p>
//         <p className="text-gray-600">{desc}</p>
//       </div>
//     </div>
//   );
// }
