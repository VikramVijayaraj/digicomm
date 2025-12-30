import Link from "next/link";
import { MoveRight } from "lucide-react";

import { getLatestProductsPerSeller } from "@/lib/db/products";
import ProductCard from "../card/product-card";

// {
//   id: 'de015cc7-3ff3-4f5d-858c-749c7e2850ce',
//   name: 'E-books',
// {
//   id: '4606326d-95b0-4018-b744-91d295ac1c56',
//   name: 'Digital Art',
// {
//   id: '08c92b9d-ca17-49b9-a9e2-7d181288367c',
//   name: 'Software & Tools',
// {
//   id: '98a1040e-8b8e-45ad-864e-1857b7e90a2e',
//   name: 'Music & Audio',
// {
//   id: '68e68f62-781f-4303-b8b5-6da0db5be437',
//   name: 'Templates & Themes',
// },
// {
//   id: '0569270b-d54e-4681-9436-8ab7fd7dc0b9',
//   name: 'Art & Collectibles',
// }

export default async function AllSections() {
  const latestEbooks = await getLatestProductsPerSeller(
    "de015cc7-3ff3-4f5d-858c-749c7e2850ce",
    8,
  );
  const latestDigitalArt = await getLatestProductsPerSeller(
    "4606326d-95b0-4018-b744-91d295ac1c56",
    8,
  );
  const latestSoftwareTools = await getLatestProductsPerSeller(
    "08c92b9d-ca17-49b9-a9e2-7d181288367c",
  );
  const latestMusicAudio = await getLatestProductsPerSeller(
    "98a1040e-8b8e-45ad-864e-1857b7e90a2e",
  );
  const latestTemplatesThemes = await getLatestProductsPerSeller(
    "68e68f62-781f-4303-b8b5-6da0db5be437",
    8,
  );

  const sections = [
    { data: latestEbooks, heading: "Popular E-books Collection" },
    { data: latestDigitalArt, heading: "Digital Art Masterpieces" },
    { data: latestTemplatesThemes, heading: "Pro Templates & Themes" },
    { data: latestSoftwareTools, heading: "Essential Software & Tools" },
    { data: latestMusicAudio, heading: "Music & Audio Collection" },
  ];

  return (
    <div className="global-padding space-y-16 lg:space-y-24">
      {sections.map(({ data, heading }) => (
        <section key={heading}>
          <div className="flex justify-center items-center gap-2 text-xl lg:text-3xl text-center pb-5 md:pb-10">
            <Link href={`/categories/${data[0].category_slug}`}>
              <h2 className="flex justify-center items-center gap-2 hover:cursor-pointer hover:translate-x-1 transition-transform">
                {heading}
                <MoveRight />
              </h2>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 lg:gap-x-8 gap-y-6">
            {data.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <ProductCard
                  name={product.name}
                  price={product.price}
                  category={product.categorie_name}
                  imgUrl={product.image_url}
                />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
