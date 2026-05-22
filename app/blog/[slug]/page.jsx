import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { ArrowLeft, ArrowRight, BookOpenText, Newspaper } from "lucide-react";

import { getBlogPostBySlug, getBlogPosts } from "@/lib/db/blog";
import { Button } from "@/components/ui/button";
import { getStoragePath } from "@/utils/utils";
import PostCard from "@/components/card/post-card";

// Cache the product data to avoid fetching it multiple times for the same slug when not using fetch
const getCurrentPost = cache(async (slug) => {
  const currentPost = await getBlogPostBySlug(slug);
  return currentPost;
});

export async function generateMetadata({ params }) {
  const { slug } = params;
  const result = await getCurrentPost(slug);

  // Take the first paragraph, <p> tag from the content for the description
  const match = result.content.match(/<p[^>]*>(.*?)<\/p>/i);
  const firstParagraph = match ? match[1] : "";

  return {
    title: result.title,
    description: result.description || firstParagraph,
  };
}

export default async function PostPage({ params }) {
  const post = await getCurrentPost(params.slug);
  const coverImagePath = getStoragePath(post?.cover_image);
  const otherBlogPosts = await getBlogPosts(6, params.slug);

  // If the post is not found or not published, return a 404 page
  if (!post || !post.published_status) {
    return notFound();
  }

  return (
    <article className="global-padding space-y-6 pb-10">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blog
      </Link>

      <section className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,247,241,1)_0%,rgba(255,255,255,1)_48%,rgba(245,248,255,1)_100%)] p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6 lg:p-7">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
            <Newspaper className="h-4 w-4" />
            {post.category}
          </div>
          <h1 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              {post.description}
            </p>
          )}
        </div>
      </section>

      <div className="relative h-[300px] w-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 shadow-[0_16px_40px_rgba(15,23,42,0.05)] md:h-[400px] lg:h-[520px]">
        <Image
          src={coverImagePath}
          alt={post.title}
          className="object-cover"
          fill
          priority
        />
      </div>

      <section className="mx-auto w-full max-w-4xl rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-7 lg:p-9">
        <div className="prose prose-neutral max-w-none prose-headings:tracking-[-0.03em] prose-headings:text-slate-950 prose-p:text-slate-600 prose-p:leading-7 prose-a:text-primary-brand prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-950 prose-li:text-slate-600 prose-blockquote:border-orange-200 prose-blockquote:text-slate-600 prose-img:rounded-[1.25rem]">
          {parse(post.content)}
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-orange-200 bg-orange-50/70 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">
              Start selling
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
              Turn your digital products into a storefront.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Create your Crelands shop and manage products, orders, and
              payments from one simple workspace.
            </p>
          </div>
          <Button
            asChild
            className="mt-5 h-12 w-full rounded-full bg-gradient-to-r from-primary-brand to-red-400 px-6 text-sm font-semibold text-white hover:from-primary-light hover:to-primary-brand sm:mt-0 sm:w-auto"
          >
            <Link href={"/your/shop/dashboard"}>
              Sign Up Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Other blog posts */}
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-5 lg:p-6">
        <div className="mb-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">
            <BookOpenText className="h-4 w-4" />
            Recommended blogs
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            Keep reading
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-x-6 lg:gap-y-8">
          {otherBlogPosts.map((post) => (
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
    </article>
  );
}
