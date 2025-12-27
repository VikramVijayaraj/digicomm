import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import parse from "html-react-parser";

import { getBlogPostBySlug, getBlogPosts } from "@/lib/db/blog";
import { Button } from "@/components/ui/button";
import { getStoragePath } from "@/utils/utils";
import PostCard from "@/components/card/post-card";
import { Separator } from "@/components/ui/separator";

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
    <article className="global-padding space-y-8 w-full md:w-[80%] xl:w-[70%] m-auto">
      <h1 className="text-[30px] md:text-[40px] font-extrabold leading-10 md:leading-[50px]">
        {post.title}
      </h1>

      <div className="relative w-full h-[300px] md:h-[350px] lg:h-[400px] rounded-lg">
        <Image
          src={coverImagePath}
          alt={post.title}
          className="object-cover rounded-lg"
          fill
          priority
        />
      </div>

      {/* <div
        className="mx-auto prose prose-neutral prose-p:text-gray-700 prose-p:my-0
          prose-p:lg:text-xl prose-p:lg:leading-[32px] prose-h1:text-gray-900
          prose-h1:font-bold prose-h2:text-gray-800 prose-h2:mt-0 prose-h2:mb-2
          prose-h2:lg:text-2xl prose-h3:text-gray-800 prose-h3:lg:text-xl
          prose-li:text-gray-700 prose-li:lg:text-xl prose-strong:text-gray-900
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-blockquote:text-gray-600 prose-blockquote:border-gray-300
          prose-code:text-gray-800 prose-code:bg-gray-100 prose-pre:bg-gray-100
          prose-pre:text-gray-800 prose-img:rounded-lg prose-h1:mb-0 prose-img:my-0"
      > */}
      <div className="prose prose-neutral max-w-none mx-auto prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
        {parse(post.content)}
      </div>

      {/* CTA button */}
      <div className="flex justify-center pb-12">
        <Button className="bg-primary-brand text-lg font-semibold md:p-6">
          <Link href={"/your/shop/dashboard"}>Sign Up Now</Link>
        </Button>
      </div>

      {/* Other blog posts */}
      <Separator />
      <div className="py-12">
        <h2 className="text-xl text-center md:text-left font-semibold pb-5 md:pb-10">
          Recommended blogs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-x-8 lg:gap-y-10">
          {otherBlogPosts.map((post) => (
            <Link href={"/blog/" + post.slug} key={post.id}>
              <PostCard
                title={post.title}
                category={post.category}
                image={post.cover_image}
              />
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
