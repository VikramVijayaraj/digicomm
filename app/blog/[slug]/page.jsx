import parse from "html-react-parser";

import { getBlogPostBySlug } from "@/lib/db/blog";
import Image from "next/image";

export default async function PostPage({ params }) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return <div className="text-center">Post not found</div>;
  }

  return (
    <div className="global-padding space-y-8 w-full md:w-[80%] xl:w-[70%] m-auto">
      <h1 className="text-4xl font-semibold">{post.title}</h1>

      <div className="relative w-full h-[300px] md:h-[350px] lg:h-[400px]">
        <Image
          src={post.cover_image}
          alt={post.title}
          className="object-cover"
          fill
          priority
        />
      </div>

      <div className="mx-auto prose prose-neutral prose-p:my-0 prose-h2:mt-0 prose-h2:mb-2">
        {parse(post.content)}
      </div>
    </div>
  );
}
