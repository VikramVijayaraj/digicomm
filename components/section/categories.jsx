import { revalidatePath } from "next/cache";
import { CiMobile3 } from "react-icons/ci";

import SectionLayout from "./section-layout";
import { getCategories } from "@/lib/db/categories";
import Link from "next/link";

export default async function Categories() {
  const result = await getCategories();

  revalidatePath("/");

  const categories = result.map((category) => (
    <Link key={category.id} href={`categories/${category.slug}`}>
      <li className="flex flex-col items-center justify-center h-36 border-2 border-gray-100 space-y-2 cursor-pointer hover:bg-red-500">
        <p className="text-5xl">
          <CiMobile3 />
        </p>
        <p className="text-xl">{category.name}</p>
      </li>
    </Link>
  ));

  return (
    <section className="global-padding">
      <SectionLayout heading="Browse By Categories">
        <ul className="grid grid-cols-6 gap-2">{categories}</ul>
      </SectionLayout>
    </section>
  );
}
