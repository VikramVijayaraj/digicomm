import Link from "next/link";
import {
  AlertCircle,
  BookOpenText,
  Newspaper,
  PackageOpen,
} from "lucide-react";

import PostCard from "@/components/card/post-card";
import { getBlogPosts } from "@/lib/db/blog";

export default async function BlogPage() {
  let posts;

  try {
    posts = await getBlogPosts();
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);

    return (
      <div className="global-padding pb-10">
        <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-[0_14px_35px_rgba(15,23,42,0.04)]">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold text-slate-950">
            Oops! Something went wrong.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            We couldn&apos;t load the blog posts. Please try again later.
          </p>
        </div>
      </div>
    );
  }
  const activePosts = posts.filter((post) => post.published_status);

  return (
    <div className="global-padding space-y-6 pb-10">
      <section className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_48%,rgba(245,248,255,1)_100%)] p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6 lg:p-7">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
            <Newspaper className="h-4 w-4" />
            Crelands Blog
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Insights, Stories, and Updates about Digital Products
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Dive into our blog for the latest trends, tips, and stories from the
            world of digital products. Whether you&apos;re a creator, buyer, or
            just curious, there&apos;s something here for everyone.
          </p>
        </div>
      </section>

      {posts.length === 0 && (
        <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-[0_14px_35px_rgba(15,23,42,0.04)]">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-primary-brand">
            <PackageOpen className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold text-slate-950">
            No posts available
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            New articles will appear here once they are published.
          </p>
        </div>
      )}

      {activePosts.length > 0 && (
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-5 lg:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">
                <BookOpenText className="h-4 w-4" />
                Latest articles
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Explore the blog
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-6 lg:gap-y-8">
            {activePosts.map((post) => (
              <Link href={"/blog/" + post.slug} key={post.id} className="group">
                <PostCard
                  title={post.title}
                  category={post.category}
                  image={post.cover_image}
                />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
