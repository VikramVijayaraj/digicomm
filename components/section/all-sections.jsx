import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getLatestProductsPerSeller } from "@/lib/db/products";
import ProductCard from "../card/product-card";
import { memo } from "react";
import SectionLayout from "./section-layout";

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

async function AllSections() {
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
  const latestArtCollectibles = await getLatestProductsPerSeller(
    "0569270b-d54e-4681-9436-8ab7fd7dc0b9",
    8,
  );

  const sections = [
    {
      data: latestEbooks,
      heading: "Popular eBooks",
      eyebrow: "Featured Collections",
      description:
        "Browse practical guides, playbooks, and creator-led resources people can use right away.",
    },
    {
      data: latestDigitalArt,
      heading: "Digital Art Picks",
      eyebrow: "Featured Collections",
      description:
        "Discover original visuals, downloadable assets, and collectible creative work from independent artists.",
    },
    {
      data: latestTemplatesThemes,
      heading: "Templates And Themes",
      eyebrow: "Featured Collections",
      description:
        "Save time with polished templates, storefront assets, and kits built for work and creation.",
    },
    {
      data: latestArtCollectibles,
      heading: "Art And Collectibles",
      eyebrow: "Featured Collections",
      description:
        "Discover unique pieces, limited editions, and exclusive content from independent creators.",
    },
    {
      data: latestSoftwareTools,
      heading: "Software And Tools",
      eyebrow: "Featured Collections",
      description:
        "Find useful digital tools, scripts, and systems that help buyers move faster and creators scale.",
    },
    // {
    //   data: latestMusicAudio,
    //   heading: "Music And Audio",
    //   eyebrow: "Featured Collections",
    //   description:
    //     "Explore ready-to-license tracks, sound packs, and audio products crafted for modern digital projects.",
    // },
  ];

  return (
    <div className="global-padding space-y-16 lg:space-y-24">
      {sections.map(({ data, heading, eyebrow, description }) => (
        <section key={heading}>
          <SectionLayout
            eyebrow={eyebrow}
            heading={heading}
            description={description}
            actionHref={
              data[0] ? `/categories/${data[0].category_slug}` : "/products"
            }
            actionLabel="View category"
            align="split"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
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
          </SectionLayout>
        </section>
      ))}

      <section className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,248,242,1)_0%,rgba(255,255,255,1)_45%,rgba(244,247,255,1)_100%)] p-8 shadow-sm md:p-10">
        <SectionLayout
          eyebrow="Marketplace Benefits"
          heading="Built for both discovery and selling"
          description="Crelands help buyers explore with confidence and give creators a clearer path to listing, selling, and getting paid."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Instant delivery",
                description:
                  "Digital products reach buyers immediately after purchase, with no manual follow-up needed.",
              },
              {
                title: "Low-friction setup",
                description:
                  "Creators can launch quickly without building a custom storefront or stitching together tools.",
              },
              {
                title: "Category-led browsing",
                description:
                  "Shoppers can move from broad interest to a specific product faster through cleaner collection blocks.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-white/80 bg-white/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <h3 className="text-xl font-semibold text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </SectionLayout>
      </section>
    </div>
  );
}

export default memo(AllSections);
