import { revalidatePath } from "next/cache";
import { CiMobile3 } from "react-icons/ci";

import SectionLayout from "./section-layout";
import { getCategories } from "@/actions/db";

export default async function Categories() {
  const result = await getCategories();
  revalidatePath("/");

  const categories = result.map((category) => (
    <li
      className="flex flex-col items-center justify-center h-36 border-2 border-gray-100 space-y-2 cursor-pointer hover:bg-red-500"
      key={category.id}
    >
      <p className="text-5xl">
        <CiMobile3 />
      </p>
      <p className="text-xl">{category.name}</p>
    </li>
  ));

  return (
    <section className="global-padding">
      <SectionLayout heading="Browse By Categories">
        <ul className="grid grid-cols-6 gap-2">{categories}</ul>
      </SectionLayout>
    </section>
  );
}
