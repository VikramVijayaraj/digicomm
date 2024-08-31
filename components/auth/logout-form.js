import { logout } from "@/actions/auth-actions";

export default function LogoutForm() {
  return (
    <form action={logout}>
      <button>Logout</button>
    </form>
  );
}
