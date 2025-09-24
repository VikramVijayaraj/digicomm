import Link from "next/link";
import { revalidatePath } from "next/cache";

import PostCard from "@/components/card/post-card";
import { getBlogPosts } from "@/lib/db/blog";

export default async function BlogPage() {
  let posts;

  try {
    posts = await getBlogPosts();
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);

    return (
      <div className="global-padding text-center h-screen">
        <h2 className="text-xl text-red-500 font-bold">
          Oops! Something went wrong.
        </h2>
        <p>We couldn&apos;t load the blog posts. Please try again later.</p>
      </div>
    );
  }
  const activePosts = posts.filter((post) => post.published_status);

  return (
    <div className="global-padding">
      <h2 className="text-xl text-center md:text-2xl lg:text-4xl font-bold pb-5 md:pb-10">
        Blog
      </h2>

      {posts.length === 0 && (
        <p className="text-center h-screen">No posts available</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-x-6 lg:gap-y-8">
        {activePosts.map((post) => (
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
  );
}
