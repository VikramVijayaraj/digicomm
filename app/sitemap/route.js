import { revalidatePath } from "next/cache";

import { getActiveBlogPosts } from "@/lib/db/blog";
import { getProducts } from "@/lib/db/products";
import { getCategories } from "@/lib/db/categories";

export async function GET() {
  try {
    const products = await getProducts();
    const categories = await getCategories();
    const blogPosts = await getActiveBlogPosts();

    const productPaths = products.map((product) => ({
      url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/products/${product.product_slug}`,
      lastModified: new Date(product.updated_at).toISOString(),
    }));

    const categoryPaths = categories.map((category) => ({
      url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/categories/${category.slug}`,
      lastModified: new Date(category.updated_at).toISOString(),
    }));

    const blogPostsPaths = blogPosts.map((post) => ({
      url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at).toISOString(),
    }));

    const staticPaths = [
      {
        url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/about-us`,
        lastModified: new Date().toISOString(),
      },
      {
        url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/contact-us`,
        lastModified: new Date().toISOString(),
      },
      {
        url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/your/shop/dashboard`,
        lastModified: new Date().toISOString(),
      },
      {
        url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/privacy-policy`,
        lastModified: new Date().toISOString(),
      },
      {
        url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/terms-and-conditions`,
        lastModified: new Date().toISOString(),
      },
      {
        url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/refunds-and-returns-policy`,
        lastModified: new Date().toISOString(),
      },
      {
        url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/blog`,
        lastModified: new Date().toISOString(),
      },
    ];

    // Generate sitemap XML
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${[...productPaths, ...categoryPaths, ...blogPostsPaths, ...staticPaths]
        .map(
          (path) => `
        <url>
          <loc>${path.url}</loc>
          <lastmod>${path.lastModified}</lastmod>
        </url>
      `,
        )
        .join("")}
    </urlset>`;

    return new Response(sitemapXml, {
      headers: {
        "Content-Type": "application/xml",
        // Reduce cache time (30 min) to ensure more frequent updates and add must-revalidate directive
        "Cache-Control": "public, max-age=1800, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response("Error generating sitemap", {
      status: 500,
    });
  }
}
