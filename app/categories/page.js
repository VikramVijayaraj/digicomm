import Link from "next/link";

import { getCategories } from "@/actions/db/categories";

export default async function CategoriesPage() {
  const result = await getCategories();

  const categories = result.map((category) => (
    <li key={category.id}>
      <Link href={`categories/${category.slug}`}>{category.name}</Link>
    </li>
  ));

  return (
    <div>
      CategoryPage
      <ul>{categories}</ul>
    </div>
  );
}
