// import { logout } from "@/actions/auth-actions";

export const metadata = {
  title: "User Profile",
  description: "User Profile",
};

export default function AuthRootLayout({ children }) {
  return (
    <>
      {/* <header>
        <p>Welcome back!</p>
        <form action={logout}>
          <button>Logout</button>
        </form>
      </header> */}
      {children}
    </>
  );
}
