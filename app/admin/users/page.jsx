import { getAllUsers } from "@/lib/db/users";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold mb-10">
        User Management
      </h1>
      <ul>
        {users.map((user) => (
          <li>{user.email}</li>
        ))}
      </ul>
    </div>
  );
}
