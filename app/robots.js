export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // disallow: ["/admin"],
      },
    ],
    sitemaps: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/sitemap.xml`,
        lastModified: new Date().toISOString(),
      },
    ],
  };
}
