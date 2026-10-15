import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
    try {
        console.log(">>> [SEED] Starting admin seeding...");
        
        const result = await auth.api.signUpEmail({
            headers: await headers(),
            body: {
                email: "admin@theatelier.com",
                password: "AdminAtelier2026!",
                name: "Indra Admin",
                role: "admin", // Ensure it matches our custom role enum
            }
        });

        console.log(">>> [SEED] Success:", result);
        return NextResponse.json({ success: true, message: "Account seeded successfully", result });
    } catch (error: any) {
        console.error(">>> [SEED] Error:", error);
        return NextResponse.json({ success: false, error: error.message || "Unknown error" }, { status: 500 });
    }
}
