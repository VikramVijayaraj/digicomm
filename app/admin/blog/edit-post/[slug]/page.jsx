import { revalidatePath } from "next/cache";

import BlogPostForm from "@/components/blog/blog-post-form";
import { getBlogPostBySlug } from "@/lib/db/blog";

export default async function EditPostPage({ params }) {
  const { slug } = params;

  // Fetch the post data using the slug
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return <div className="text-center">Post not found</div>;
  }

  revalidatePath("/");

  return (
    <div>
      <h1 className="text-2xl text-center font-semibold mb-10">Edit Post</h1>

      <BlogPostForm
        currentTitle={post.title}
        currentCategory={post.category}
        currentContent={post.content}
        currentImage={post.cover_image}
      />
    </div>
  );
}
