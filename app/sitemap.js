import { getProducts } from "@/lib/db/products";

export default async function sitemap() {
  const products = await getProducts();

  const productPaths = products.map((product) => ({
    url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/products/${product.product_slug}`,
    lastModified: new Date(product.updated_at).toISOString(),
    // changeFrequency: "daily",
    // priority: 0.7,
  }));

  return [
    ...productPaths,
    {
      url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/about-us`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/contact-us`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/your/shop/dashboard`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/privacy-policy`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/terms-and-conditions`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/refunds-and-returns-policy`,
    },
  ];
}
