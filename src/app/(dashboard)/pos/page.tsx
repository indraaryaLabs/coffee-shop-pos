"use client";

import { useState } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { CategoryFilter } from "@/components/pos/CategoryFilter";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { OrderSidebar } from "@/components/pos/OrderSidebar";
import type { CategoryValue } from "@/lib/data/products";

export default function POSPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryValue>("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <TopNav
        searchPlaceholder="Search products..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className="pt-16 flex h-screen overflow-hidden">
        {/* Product Catalog Section */}
        <section className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <ProductGrid
            activeCategory={activeCategory}
            searchQuery={searchQuery}
          />
        </section>

        {/* Order Summary Sidebar */}
        <OrderSidebar />
      </main>
    </>
  );
}
