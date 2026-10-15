import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	console.log("Proxy intercepted:", pathname);

	const isAuthPage = pathname === "/login" || pathname === "/signup";
	
	// Server-side session check (Better Auth v16 Node.js runtime support)
	const session = await auth.api.getSession({
		headers: await headers()
	});

	// 1. Authenticated users on login/signup -> Redirect to Dashboard
	if (session && isAuthPage) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// 2. Unauthenticated users on protected routes -> Redirect to Login
	if (!session && !isAuthPage && !pathname.startsWith("/api") && !pathname.includes(".")) {
		return NextResponse.redirect(new URL("/login", request.url));
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
		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
