import { revalidatePath } from "next/cache";
import Link from "next/link";
import Image from "next/image";

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
        <div
          className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2 lg:gap-x-8
            gap-y-6"
        >
          {/* <div className="flex flex-wrap gap-4"> */}
          {/* {categoryCards} */}
          {categories.map((category) => (
            <Link
              className="m-auto"
              key={category.id}
              href={`categories/${category.slug}`}
            >
              <div
                className="relative h-[100px] w-[100px] lg:h-[200px] lg:w-[200px] overflow-hidden
                  rounded-xl group hover:scale-105 transition delay-50 ease-in-out"
              >
                <Image
                  src={category.image_url}
                  className="object-cover"
                  fill
                  alt={category.name}
                />
                {/* Permanent overlay with text */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                  <p className="text-white font-semibold lg:text-2xl text-center px-4">
                    {category.name}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </SectionLayout>
    </section>
  );
}
