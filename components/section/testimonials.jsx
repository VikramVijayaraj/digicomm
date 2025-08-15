import React from "react";

import { Card, CardContent, CardFooter } from "../ui/card";
import StarRating from "../ui/star-rating";
import SectionLayout from "./section-layout";

export default function Testimonials() {
  return (
    <section className="global-padding">
      <SectionLayout heading="What creators say">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <TestimonialCard client="Sriram">
            <div className="space-y-4">
              <StarRating rating={5} disabled={true} />
              <p>
                “Crelands made starting my e-book store a breeze. Secure payouts
                and a beautiful interface.”
              </p>
            </div>
          </TestimonialCard>

          <TestimonialCard client="Priya">
            <div className="space-y-4">
              <StarRating rating={5} disabled={true} />
              <p>
                “It’s so easy to set up my shop and share it. In less than few
                minutes, my digital art was live and ready for sale.”
              </p>
            </div>
          </TestimonialCard>

          <TestimonialCard client="Vijay Kumar">
            <div className="space-y-4">
              <StarRating rating={5} disabled={true} />
              <p>
                “Finally, a platform built with Indian creators in mind.
                Payments, and features all just work for me here.”
              </p>
            </div>
          </TestimonialCard>
        </div>
      </SectionLayout>
    </section>
  );
}

function TestimonialCard({ client, children, ...props }) {
  return (
    <Card
      {...props}
      className="h-[230px] flex flex-col justify-between mb-4" // Make Card a flex column
    >
      <CardContent className="mt-8">{children}</CardContent>
      <CardFooter className="mt-auto">
        <p className="font-semibold">- {client}</p>
      </CardFooter>
    </Card>
  );
}
