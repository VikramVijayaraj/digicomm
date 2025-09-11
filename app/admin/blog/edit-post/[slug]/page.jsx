import { unstable_noStore } from "next/cache";

import BlogPostForm from "@/components/blog/blog-post-form";
import { getBlogPostBySlug } from "@/lib/db/blog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditPostPage({ params }) {
  unstable_noStore();

  const { slug } = params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return <div className="text-center">Post not found</div>;
  }

  return (
    <div>
      <h1 className="text-2xl text-center font-semibold mb-10">Edit Post</h1>

      <BlogPostForm
        currentTitle={post.title}
        currentDescription={post.description}
        currentCategory={post.category}
        currentContent={post.content}
        currentImage={post.cover_image}
        currentSlug={slug}
      />
    </div>
  );
}
