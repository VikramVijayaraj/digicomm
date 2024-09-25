import { getCategories } from "@/lib/db/categories";
import NewProductForm from "@/components/product/new-product/new-product-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const categories = await getCategories();

  return (
    <div>
      <NewProductForm session={session} categories={categories} />
    </div>
  );
}
