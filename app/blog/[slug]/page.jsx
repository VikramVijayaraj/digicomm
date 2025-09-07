import { cache } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import parse from "html-react-parser";

import { getBlogPostBySlug } from "@/lib/db/blog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

  // If the post is not found or not published, return a 404 page
  if (!post || !post.published_status) {
    return notFound();
  }


  return (
    <article className="global-padding space-y-8 w-full md:w-[80%] xl:w-[70%] m-auto">
      <h1 className="text-[30px] md:text-[40px] font-extrabold leading-10 md:leading-[50px]">
        {post.title}
      </h1>

      <div className="relative w-full h-[300px] md:h-[350px] lg:h-[400px]">
        <Image
          src={post.cover_image}
          alt={post.title}
          className="object-cover"
          fill
          priority
        />
      </div>

      <div
        className="mx-auto prose prose-neutral prose-p:text-gray-700 prose-p:my-0
          prose-p:lg:text-xl prose-p:lg:leading-[32px] prose-h1:text-gray-900
          prose-h1:font-bold prose-h2:text-gray-800 prose-h2:mt-0 prose-h2:mb-2
          prose-h2:lg:text-2xl prose-h3:text-gray-800 prose-h3:lg:text-xl
          prose-li:text-gray-700 prose-li:lg:text-xl prose-strong:text-gray-900
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-blockquote:text-gray-600 prose-blockquote:border-gray-300
          prose-code:text-gray-800 prose-code:bg-gray-100 prose-pre:bg-gray-100
          prose-pre:text-gray-800 prose-img:rounded-lg prose-h1:mb-0 prose-img:my-0"
      >
        {parse(post.content)}
      </div>

      {/* CTA button */}
      <div className="flex justify-center">
        <Button className="bg-primary-brand text-lg font-semibold md:p-6">
          <Link href={"/your/shop/dashboard"}>Sign Up Now</Link>
        </Button>
      </div>
    </article>
  );
}
