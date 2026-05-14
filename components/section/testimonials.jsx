import React from "react";
import { Quote } from "lucide-react";

import { Card, CardContent, CardFooter } from "../ui/card";
import StarRating from "../ui/star-rating";
import SectionLayout from "./section-layout";

export default function Testimonials() {
  return (
    <section className="global-padding">
      <SectionLayout
        eyebrow="Social Proof"
        heading="What people like about Crelands"
        description="The marketplace should feel useful, so these testimonials reflect product discovery, selling speed, and India-first payments."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <TestimonialCard client="Sriram" role="eBook seller">
            <div className="space-y-4">
              <StarRating rating={5} disabled={true} />
              <p>
                “Crelands made launching my eBook store straightforward. The
                checkout feels polished, and payouts are easy to trust.”
              </p>
            </div>
          </TestimonialCard>

          <TestimonialCard client="Priya" role="digital product buyer">
            <div className="space-y-4">
              <StarRating rating={5} disabled={true} />
              <p>
                “I found a planner and a design template in one session. The
                category browsing made it much easier to compare options.”
              </p>
            </div>
          </TestimonialCard>

          <TestimonialCard client="Vijay Kumar" role="creator and seller">
            <div className="space-y-4">
              <StarRating rating={5} disabled={true} />
              <p>
                “Finally, a platform that works for Indian creators and the
                people buying from them. Payments and delivery feel seamless.”
              </p>
            </div>
          </TestimonialCard>
        </div>
      </SectionLayout>
    </section>
  );
}

function TestimonialCard({ client, role, children, ...props }) {
  return (
    <Card
      {...props}
      className="flex h-full flex-col justify-between rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
    >
      <CardContent className="mt-0 p-6">
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-primary-brand">
          <Quote className="h-5 w-5" />
        </div>
        <div className="space-y-4 text-slate-700">{children}</div>
      </CardContent>
      <CardFooter className="mt-auto flex-col items-start gap-1 p-6 pt-0">
        <p className="font-semibold text-slate-950">{client}</p>
        <p className="text-sm text-slate-500">{role}</p>
      </CardFooter>
    </Card>
  );
}
