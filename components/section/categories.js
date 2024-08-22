import { categories } from "@/lib/data";
import SectionLayout from "./section-layout";

export default function Categories() {
  return (
    <section className="global-padding">
      <SectionLayout heading="Browse By Categories">
        <ul className="grid grid-cols-6 gap-2">
          {categories.map((category, index) => (
            <li
              className="flex flex-col items-center justify-center h-36 border-2 border-gray-100 space-y-2 cursor-pointer hover:bg-red-500"
              key={index}
            >
              <p className="text-5xl">{category.icon}</p>
              <p className="text-xl">{category.name}</p>
            </li>
          ))}
        </ul>
      </SectionLayout>
    </section>
  );
}
