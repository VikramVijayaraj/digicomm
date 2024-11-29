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
import Image from "next/image";

export default async function Categories() {
  const categories = await getCategories();

  revalidatePath("/");

  // const categoryCards = categories.map((category) => (
  //   <div className="grid grid-cols-3">
  //     <Link key={category.id} href={`categories/${category.slug}`}>
  //       <Card
  //       className="border-none shadow-none text-center hover:scale-105 transition delay-50
  //         ease-in-out"
  //     >
  //       <CardHeader>
  //         <CardTitle className="flex m-auto">
  //       <Package />
  //       <div className="relative h-20 w-20 md:h-28 md:w-28">
  //       <Image
  //         src={category.image_url || "/images/categories/digital-art.jpg"}
  //         className="object-cover rounded-lg"
  //         fill
  //       />
  //     </div>
  //       </CardTitle>
  //       </CardHeader>
  //       <CardContent>
  //         <p className="text-sm md:text-base">{category.name}</p>
  //       </CardContent>
  //     </Card>
  //     </Link>
  //   </div>
  // ));

  return (
    <section className="global-padding">
      <SectionLayout heading="Categories">
        {/* <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4"> */}
        <div className="flex flex-wrap gap-3">
          {/* {categoryCards} */}
          {categories.map((category) => (
            <Link
              className="m-auto hover:scale-105 transition delay-50 ease-in-out"
              key={category.id}
              href={`categories/${category.slug}`}
            >
              <div className="relative h-20 w-20 md:h-28 md:w-28">
                <Image
                  src={category.image_url}
                  className="object-cover rounded-md"
                  fill
                  alt={category.name}
                />
              </div>
              <p className="mt-2 text-sm md:text-base text-center w-20 h-12 md:w-28">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </SectionLayout>
    </section>
  );
}
