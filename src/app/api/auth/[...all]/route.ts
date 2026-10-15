import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

const { GET: authGET, POST: authPOST } = toNextJsHandler(auth);

export async function POST(req: NextRequest) {
	try {
		console.log(">>> [AUTH API] POST request received at:", req.nextUrl.pathname);
		return await authPOST(req);
	} catch (error) {
		console.error(">>> [AUTH API] FATAL CRASH:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}

export async function GET(req: NextRequest) {
	try {
		console.log(">>> [AUTH API] GET request received at:", req.nextUrl.pathname);
		return await authGET(req);
	} catch (error) {
		console.error(">>> [AUTH API] FATAL CRASH:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
