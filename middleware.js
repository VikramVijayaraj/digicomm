import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default async function middleware(request) {
  // Check maintenance mode first
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";

  if (isMaintenanceMode) {
    // Skip maintenance page and static assets
    if (
      request.nextUrl.pathname === "/maintenance" ||
      request.nextUrl.pathname.startsWith("/_next") ||
      request.nextUrl.pathname.startsWith("/api") ||
      request.nextUrl.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js)$/)
    ) {
      return NextResponse.next();
    }

    // Redirect to maintenance page
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  // If not in maintenance mode, run auth middleware
  return auth(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
