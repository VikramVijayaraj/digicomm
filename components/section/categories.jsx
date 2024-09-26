import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Package } from "lucide-react";

import SectionLayout from "./section-layout";
import { getCategories } from "@/lib/db/categories";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Categories() {
  const result = await getCategories();

  revalidatePath("/");

  const categories = result.map((category) => (
    <Link key={category.id} href={`categories/${category.slug}`}>
      <Card className="h-32 text-center hover:scale-105 transition delay-50 ease-in-out">
        <CardHeader>
          <CardTitle className="flex m-auto">
            <Package />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{category.name}</p>
        </CardContent>
      </Card>
      {/* <li
        className="flex flex-col items-center justify-center h-36 border-2 border-gray-100
          space-y-2 cursor-pointer hover:bg-red-500"
      >
        <p className="text-5xl">
          <Package />
        </p>
        <p className="text-xl">{category.name}</p>
      </li> */}
    </Link>
  ));

  return (
    <section className="global-padding">
      <SectionLayout heading="Browse By Categories">
        <div className="grid grid-cols-6 gap-2">{categories}</div>
      </SectionLayout>
    </section>
  );
}
