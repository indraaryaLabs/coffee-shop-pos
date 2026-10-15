"use server";

import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, inventory, recipeIngredients } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function restockProduct(productId: string, quantity: number) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    if (!productId || quantity <= 0) {
      return { success: false, error: "Invalid restock payload." };
    }

    await db
      .update(inventory)
      .set({
        currentStock: sql`${inventory.currentStock} + ${quantity}`,
        status: "in_stock",
        lastRestocked: new Date(),
      })
      .where(eq(inventory.productId, productId));

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Restock error:", error);
    return { success: false, error: error.message || "Failed to restock." };
  }
}

export async function deleteProduct(productId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    if (!productId) {
      return { success: false, error: "Product ID required." };
    }

    // Delete in transaction: inventory row -> recipe links -> product row
    await db.transaction(async (tx) => {
      // Delete inventory entry
      await tx.delete(inventory).where(eq(inventory.productId, productId));
      // Delete recipe ingredients referencing this product (as menu or raw material)
      await tx.delete(recipeIngredients).where(eq(recipeIngredients.menuProductId, productId));
      await tx.delete(recipeIngredients).where(eq(recipeIngredients.rawMaterialId, productId));
      // Delete product itself
      await tx.delete(products).where(eq(products.id, productId));
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Delete error:", error);
    return { success: false, error: error.message || "Failed to delete product." };
  }
}

export async function updateInventoryItem(
  productId: string,
  data: {
    name: string;
    category: string;
    price: string;
    currentStock: number;
    type: "retail" | "raw_material" | "menu";
  }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    if (!productId) {
      return { success: false, error: "Product ID required." };
    }

    await db.transaction(async (tx) => {
      // Update core product details
      await tx
        .update(products)
        .set({
          name: data.name,
          category: data.category,
          price: data.price,
          type: data.type,
        })
        .where(eq(products.id, productId));

      // Update inventory specifics
      const newStatus = data.currentStock <= 0 ? "out_of_stock" : data.currentStock <= 5 ? "low_stock" : "in_stock";
      await tx
        .update(inventory)
        .set({
          currentStock: data.currentStock,
          status: newStatus,
        })
        .where(eq(inventory.productId, productId));
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Update error:", error);
    return { success: false, error: "Failed to update item." };
  }
}
