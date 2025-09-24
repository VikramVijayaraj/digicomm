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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        <Link href="/admin/users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Manage users</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/sellers-bank-details">
          <Card>
            <CardHeader>
              <CardTitle>Sellers Bank Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Manage sellers bank details</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
