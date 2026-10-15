"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateProductDescription(productId: string, description: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    if (!productId || !description) {
      return { success: false, error: "Product ID and description are required." };
    }

    await db
      .update(products)
      .set({ description })
      .where(eq(products.id, productId));

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Update description error:", error);
    return { success: false, error: error.message || "Failed to update description." };
  }
}

export async function updateProductDetails(
  productId: string, 
  data: { name?: string; description?: string; price?: number }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    if (!productId) {
      return { success: false, error: "Product ID is required." };
    }

    const updateData: Record<string, any> = {};
    if (data.name) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price.toString();

    if (Object.keys(updateData).length === 0) {
      return { success: false, error: "No changes provided." };
    }

    await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, productId));

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Update product error:", error);
    return { success: false, error: error.message || "Failed to update product." };
  }
}
