"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { products, inventory, recipeIngredients } from "@/lib/db/schema";
import { createClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";

// Helper function to lazily initialize Supabase Storage
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env");
  }
  return createClient(url, key);
}

export async function createProduct(formData: FormData) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session || !session.user || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const price = parseFloat(formData.get("price") as string);
    const initialStock = parseInt(formData.get("initialStock") as string, 10);
    const imageFile = formData.get("image") as File;
    const productType = (formData.get("type") as string) || "menu"; // menu | retail | raw_material
    
    // Parse recipe ingredients JSON if provided
    const ingredientsJson = formData.get("ingredients") as string;
    let ingredientsList: { rawMaterialId: string; quantityNeeded: number; unit: string }[] = [];
    if (ingredientsJson) {
      try {
        ingredientsList = JSON.parse(ingredientsJson);
      } catch { /* ignore parse errors */ }
    }

    if (!name || isNaN(price)) {
      return { success: false, error: "Invalid product payload." };
    }

    // Validate: menu items must have ingredients
    if (productType === "menu" && ingredientsList.length === 0) {
      return { success: false, error: "Menu items must have at least 1 ingredient." };
    }

    let imageUrl = "/images/placeholder.jpg"; // Default fallback

    // Attempt Image Upload if a valid file exists
    if (imageFile && imageFile.size > 0) {
      try {
        const supabase = getSupabase();
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { data, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          return { success: false, error: "Failed to upload image to storage" };
        }

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      } catch (storageError: any) {
        console.error("Supabase configuration problem", storageError);
        return { success: false, error: "Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file to enable image uploads." };
      }
    }

    // Insert Product, Inventory, and Recipe atomically
    await db.transaction(async (tx) => {
      // 1. Insert product with type and description
      const [newProduct] = await tx.insert(products).values({
        name,
        category,
        type: productType as any,
        price: price.toString(),
        description: description || null,
        imageUrl,
      }).returning();

      // 2. Insert inventory for retail & raw_material (menu items don't need stock)
      if (productType === "retail" || productType === "raw_material") {
        const stock = isNaN(initialStock) ? 0 : initialStock;
        await tx.insert(inventory).values({
          productId: newProduct.id,
          currentStock: stock,
          unit: "pcs",
          status: stock > 5 ? "in_stock" : (stock > 0 ? "low_stock" : "out_of_stock"),
        });
      }

      // 3. If this is a menu item with recipe ingredients, save them
      if (productType === "menu" && ingredientsList.length > 0) {
        for (const ing of ingredientsList) {
          await tx.insert(recipeIngredients).values({
            menuProductId: newProduct.id,
            rawMaterialId: ing.rawMaterialId,
            quantityNeeded: ing.quantityNeeded.toString(),
            unit: ing.unit || "pcs",
          });
        }
      }

      return newProduct;
    });

    revalidatePath('/', 'layout');

    return { success: true };
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return { success: false, error: error.message || "Failed to create product" };
  }
}

export async function editProduct(formData: FormData) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session || !session.user || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const priceStr = formData.get("price") as string;
    const currentStockStr = formData.get("currentStock") as string;
    const imageFile = formData.get("image") as File;
    const productType = formData.get("type") as string;

    if (!id || !name || !priceStr) {
      return { success: false, error: "Missing required fields." };
    }

    const price = parseFloat(priceStr);
    
    let updatePayload: any = {
      name,
      description: description || null,
      category,
      price: price.toString(),
      type: productType as any,
    };

    // Handle Image Upload if a new file is provided
    if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
      try {
        const supabase = getSupabase();
        const fileExt = imageFile.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { data, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          return { success: false, error: "Failed to upload new image to storage" };
        }

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        updatePayload.imageUrl = publicUrlData.publicUrl;
      } catch (storageError: any) {
        console.error("Supabase configuration problem", storageError);
        return { success: false, error: "Storage error occurred during edit." };
      }
    }

    await db.transaction(async (tx) => {
      // 1. Update Core Product
      await tx.update(products)
        .set(updatePayload)
        .where(eq(products.id, id));

      // 2. Update Inventory Stock if applicable
      if (currentStockStr && (productType === "retail" || productType === "raw_material")) {
        const stock = parseInt(currentStockStr, 10);
        if (!isNaN(stock)) {
          const newStatus = stock <= 0 ? "out_of_stock" : stock <= 5 ? "low_stock" : "in_stock";
          await tx.update(inventory)
            .set({ currentStock: stock, status: newStatus })
            .where(eq(inventory.productId, id));
        }
      }
    });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to edit product:", error);
    return { success: false, error: error.message || "Failed to edit product." };
  }
}
