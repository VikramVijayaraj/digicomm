import Link from "next/link";

import BlogPostForm from "@/components/blog/blog-post-form";
import { Button } from "@/components/ui/button";

export default function NewPostPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-center font-semibold">New Post</h1>
        <Button asChild variant="secondary">
          <Link href="/blog">View all posts</Link>
        </Button>
      </div>
    
      <BlogPostForm />
    </div>
  );
}
