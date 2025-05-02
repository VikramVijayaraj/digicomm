import CreatePost from "@/components/blog/create-post";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewPostPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-center font-semibold">New Post</h1>
        <Button asChild variant="secondary">
          <Link href="/blog">View all posts</Link>
        </Button>
      </div>
      <CreatePost />
    </div>
  );
}
