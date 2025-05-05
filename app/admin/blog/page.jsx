import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Plus } from "lucide-react";

import { getBlogPosts } from "@/lib/db/blog";
import { Button } from "@/components/ui/button";
import TogglePostStatus from "@/components/blog/toggle-post-status";

export default async function AdminBlogPage() {
  // Fetch blog posts from the database
  const posts = await getBlogPosts();

  revalidatePath("/admin/blog");

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold mb-10">
        Blog Management
      </h1>

      <Button asChild className="w-40">
        <Link href="/admin/blog/new-post">
          <Plus size={15} /> New Post
        </Link>
      </Button>

      <ul className="mt-5 space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="flex justify-between">
            <Link href={"/blog/" + post.slug} className="hover:underline">
              {post.title}
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href={"/admin/blog/edit-post/" + post.slug}
                className="text-blue-500 hover:underline"
              >
                Edit
              </Link>

              <TogglePostStatus post={post} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
