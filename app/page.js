import { redirect } from "next/navigation";

import Categories from "@/components/section/categories";
import BestSelling from "@/components/section/best-selling";
import Banner from "@/components/banner/banner";
import Newsletter from "@/components/cta/newsletter";
import { auth } from "@/auth";
import { getUserByEmail } from "@/lib/db/users";

export default async function Home() {
  const session = await auth();

  if (session?.user?.email) {
    const result = await getUserByEmail(session.user.email);

    if (result.length === 0) {
      redirect("/register");
    }
  }

  return (
    <main>
      <Banner />
      <Categories />
      <BestSelling />
      <Newsletter />
    </main>
  );
}
