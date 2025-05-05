import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminPage() {
  return (
    <div className="">
      <h1 className="text-center text-2xl font-semibold mb-10">
        Admin Dashboard
      </h1>

      <Link href="/admin/blog">
        <Card>
          <CardHeader>
            <CardTitle>Blog</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Manage blog posts</p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
