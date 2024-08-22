import Categories from "@/components/section/categories";
import BestSelling from "@/components/section/best-selling";
import Banner from "@/components/banner/banner";
import Newsletter from "@/components/cta/newsletter";

export default function Home() {
  return (
    <main>
      <Banner />
      <Categories />
      <BestSelling />
      <Newsletter />
    </main>
  );
}
