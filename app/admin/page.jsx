import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminPage() {
  return (
    <div className="">
      <h1 className="text-center">Admin Dashboard</h1>

      <Button asChild className="mt-20">
        <Link href="/admin/new-post">New Blog Post</Link>
      </Button>
    </div>
  );
}
