"use server";

import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, inventory, transactions, transactionItems, recipeIngredients } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type CheckoutPayload = {
  items: { productId: string; quantity: number; price: number }[];
  totalAmount: number;
  paymentMethod: "cash" | "card" | "qr_code";
  customerName?: string;
  tableNumber?: string;
};

export async function processCheckout(payload: CheckoutPayload) {
  try {
    // 1. Verify Cashier
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized. Please log in first." };
    }

    const { items, totalAmount, paymentMethod, customerName, tableNumber } = payload;
    
    if (!items || items.length === 0) {
      return { success: false, error: "Cart is empty." };
    }

    // 2. Run Database Transaction (ACID)
    const transactionRecord = await db.transaction(async (tx) => {
      // a. Insert the main transaction
      const [newTx] = await tx
        .insert(transactions)
        .values({
          cashierId: session.user.id,
          totalAmount: totalAmount.toString(),
          paymentMethod,
          status: "completed",
          customerName: customerName || null,
          tableNumber: tableNumber || null,
        })
        .returning();

      // b. Loop items to save & deduct inventory
      for (const item of items) {
        // Get product type
        const [product] = await tx
          .select({ type: products.type, name: products.name })
          .from(products)
          .where(eq(products.id, item.productId));

        if (!product) {
          throw new Error(`Product not found for ID: ${item.productId}`);
        }

        // Insert Transaction Item
        await tx.insert(transactionItems).values({
          transactionId: newTx.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtTime: item.price.toString(),
        });

        if (product.type === "retail") {
          // --- RETAIL: Directly decrease product inventory ---
          const [currentInv] = await tx
            .select({ currentStock: inventory.currentStock })
            .from(inventory)
            .where(eq(inventory.productId, item.productId));

          if (!currentInv) {
            throw new Error(`Inventory not found for retail product: ${product.name}`);
          }

          if (currentInv.currentStock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}. Available: ${currentInv.currentStock}`);
          }

          await tx
            .update(inventory)
            .set({
              currentStock: sql`${inventory.currentStock} - ${item.quantity}`,
            })
            .where(eq(inventory.productId, item.productId));

        } else if (product.type === "menu") {
          // --- MENU: Decrease raw material inventory via recipe ---
          const recipe = await tx
            .select({
              rawMaterialId: recipeIngredients.rawMaterialId,
              quantityNeeded: recipeIngredients.quantityNeeded,
            })
            .from(recipeIngredients)
            .where(eq(recipeIngredients.menuProductId, item.productId));

          // For each ingredient in the recipe, deduct stock
          for (const ingredient of recipe) {
            const qtyToDeduct = Number(ingredient.quantityNeeded) * item.quantity;

            const [rawInv] = await tx
              .select({ currentStock: inventory.currentStock })
              .from(inventory)
              .where(eq(inventory.productId, ingredient.rawMaterialId));

            if (rawInv && rawInv.currentStock >= qtyToDeduct) {
              await tx
                .update(inventory)
                .set({
                  currentStock: sql`${inventory.currentStock} - ${qtyToDeduct}`,
                })
                .where(eq(inventory.productId, ingredient.rawMaterialId));
            }
            // If no inventory row or insufficient stock, silently skip
            // (menu items are always available — ingredients are just tracked)
          }
        }
      }

      return newTx;
    });

    // 3. Revalidate paths so UI updates globally
    revalidatePath("/", "layout");

    return {
      success: true,
      transactionId: transactionRecord.id,
    };
  } catch (error: any) {
    console.error("Critical Backend Tx Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred during checkout.",
    };
  }
}
