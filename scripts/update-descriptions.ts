import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Missing DATABASE_URL");
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

// Map product names to proper descriptions (Indonesian coffeeshop context)
const descriptionMap: Record<string, string> = {
  // Coffee
  "Kopi Susu Gula Aren": "Perpaduan kopi robusta pilihan dengan gula aren asli Nusantara dan susu segar",
  "Coffee Latte": "Espresso shot dengan steamed milk lembut dan latte art cantik",
  "Vanilla Latte": "Latte klasik dengan sentuhan vanilla premium yang manis dan creamy",
  "Espresso": "Single shot espresso dari biji kopi pilihan, bold dan intense",
  "Double Espresso": "Double shot espresso kuat untuk pecinta kopi sejati",
  "Americano": "Espresso yang diencerkan air panas, cita rasa kopi murni",
  "Cappuccino": "Espresso dengan foam susu tebal dan taburan cocoa powder",
  "Flat White": "Espresso kuat dengan microfoam susu yang silky dan creamy",
  "Mocha": "Perpaduan espresso, cokelat premium, dan steamed milk",
  "Cold Brew": "Kopi seduh dingin 16 jam, smooth dan rendah asam",
  "Iced V60": "Pour-over single origin dengan es batu, segar dan fruity",
  "Oat Milk Latte": "Latte dengan susu oat barista edition, plant-based dan creamy",
  "Cortado": "Espresso seimbang dengan sedikit susu hangat, bold namun smooth",
  "Ethiopian S.O.": "Single origin Ethiopia Yirgacheffe, notes buah dan floral",
  "Kopi Tubruk": "Kopi tradisional Indonesia diseduh langsung, kental dan khas",
  "Es Kopi Susu": "Es kopi susu kekinian dengan gula aren dan susu segar",
  
  // Non-Coffee
  "Ceremonial Matcha": "Matcha grade ceremonial dari Uji, Jepang dengan susu oat",
  "Chai Latte": "Teh masala India dengan rempah pilihan dan steamed milk",
  "Hot Chocolate": "Cokelat Belgia premium dengan whipped cream lembut",
  "Fresh Orange Juice": "Jus jeruk segar peras tanpa tambahan gula",
  "Teh Tarik": "Teh susu khas Malaysia yang ditarik hingga berbusa",
  "Lemon Tea": "Teh hitam segar dengan perasan lemon dan madu",
  
  // Food  
  "Butter Croissant": "Croissant renyah berlapis-lapis dengan butter premium Prancis",
  "Pain au Chocolat": "Pastry flaky dengan cokelat hitam premium di dalamnya",
  "Almond Croissant": "Croissant isi marzipan dengan taburan almond panggang",
  "Atelier Sourdough": "Roti sourdough artisan dengan avocado dan telur poached",
  "Banana Bread": "Roti pisang homemade yang lembut dengan walnut panggang",
  "Cheese Cake": "New York cheesecake creamy dengan base biskuit renyah",
  "Roti Bakar": "Roti panggang dengan selai dan mentega, comfort food klasik",
  
  // Merchandise
  "Atelier Tote Bag": "Tas kanvas limited edition dengan desain eksklusif The Atelier",
  "Ceramic Mug": "Mug keramik hand-thrown 12oz, desain minimalis premium",
};

async function updateDescriptions() {
  console.log("🔄 Updating product descriptions...\n");

  // Fetch all products
  const allProducts = await db
    .select({ id: schema.products.id, name: schema.products.name, description: schema.products.description })
    .from(schema.products);

  let updated = 0;
  let skipped = 0;

  for (const product of allProducts) {
    const newDesc = descriptionMap[product.name];
    if (newDesc) {
      await db
        .update(schema.products)
        .set({ description: newDesc })
        .where(eq(schema.products.id, product.id));
      
      console.log(`  ✅ ${product.name}: "${newDesc}"`);
      updated++;
    } else {
      // If no mapping found but has generic description, skip
      console.log(`  ⏭️  ${product.name}: no mapping (current: "${product.description}")`);
      skipped++;
    }
  }

  console.log(`\n✅ Done! Updated: ${updated}, Skipped: ${skipped}`);
  process.exit(0);
}

updateDescriptions().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
