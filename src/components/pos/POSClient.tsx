"use client";

import { useState } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { CategoryFilter } from "@/components/pos/CategoryFilter";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { OrderSidebar } from "@/components/pos/OrderSidebar";
import type { CategoryValue, Product } from "@/lib/data/products";
import { AddProductDialog } from "./AddProductDialog";

interface RawMaterial {
  id: string;
  name: string;
  currentStock: number;
  unit: string;
}

interface POSClientProps {
  initialProducts: Product[];
  rawMaterials?: RawMaterial[];
}

export function POSClient({ initialProducts, rawMaterials = [] }: POSClientProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryValue | string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <TopNav
        searchPlaceholder="Search products..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      >
        <AddProductDialog rawMaterials={rawMaterials} />
      </TopNav>

      <main className="pt-16 flex h-screen overflow-hidden">
        {/* Product Catalog Section */}
        <section className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <CategoryFilter
              activeCategory={activeCategory as CategoryValue}
              onCategoryChange={setActiveCategory}
            />
          </div>
          
          <ProductGrid
            products={initialProducts}
            activeCategory={activeCategory as CategoryValue}
            searchQuery={searchQuery}
          />
        </section>

        {/* Order Summary Sidebar */}
        <OrderSidebar />
      </main>
    </>
  );
}
