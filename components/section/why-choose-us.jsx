import { BadgePercent, IndianRupee, Store } from "lucide-react";
import SectionLayout from "./section-layout";

export default function WhyChooseUs() {
  return (
    <section className="global-padding">
      <SectionLayout heading="Why creators choose Crelands">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <Card
            title="Zero Commission"
            desc="Keep 100% of your earnings with no hidden fees or subscriptions."
          >
            <BadgePercent className="text-primary-brand" />
          </Card>

          <Card
            title="Instant Store Setup"
            desc="Start selling digital products in minutes, without any tech skills."
          >
            <Store className="text-primary-brand" />
          </Card>

          <Card
            title="Made for India"
            desc=" Local payments, and audience reach for India's growing creator economy."
          >
            <IndianRupee className="text-primary-brand" />
          </Card>
        </div>
      </SectionLayout>
    </section>
  );
}

function Card({ children, title, desc }) {
  return (
    <div
      className="bg-secondary p-8 rounded-xl space-y-4 border hover:scale-105
        transition-transform"
    >
      {children}
      <div className="space-y-1">
        <p className="text-lg font-bold">{title}</p>
        <p className="text-gray-600">{desc}</p>
      </div>
    </div>
  );
}
