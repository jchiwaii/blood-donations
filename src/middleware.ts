import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Define private routes
  const isPrivate = ["/donor", "/recipient", "/recepient", "/admin"].some(
    (path) => pathname.startsWith(path)
  );

  // Define public routes (login/register pages)
  const isPublicAuthPage = pathname === "/" || pathname.startsWith("/auth");

  const authToken = request.cookies.get("auth_token")?.value;

  // If trying to access private route without token, redirect to home
  if (isPrivate && !authToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If has token, verify and get user role
  if (authToken) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "your-secret-key"
      );
      const { payload } = await jwtVerify(authToken, secret);

      const userRole = payload.role as string;

      // If on public auth page and logged in, redirect to dashboard
      if (isPublicAuthPage) {
        if (userRole === "admin") {
          return NextResponse.redirect(
            new URL("/admin/dashboard", request.url)
          );
        } else if (userRole === "donor") {
          return NextResponse.redirect(
            new URL("/donor/dashboard", request.url)
          );
        } else if (userRole === "recipient") {
          return NextResponse.redirect(
            new URL("/recipient/dashboard", request.url)
          );
        }
      }

      // Check if user is trying to access wrong role's dashboard
      if (isPrivate) {
        if (pathname.startsWith("/admin") && userRole !== "admin") {
          return NextResponse.redirect(new URL("/", request.url));
        }
        if (pathname.startsWith("/donor") && userRole !== "donor") {
          return NextResponse.redirect(new URL("/", request.url));
        }
        if (
          (pathname.startsWith("/recipient") ||
            pathname.startsWith("/recepient")) &&
          userRole !== "recipient"
        ) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      }
    } catch (error) {
      // Invalid token, clear it and redirect to home
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
