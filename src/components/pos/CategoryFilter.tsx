"use client";

import { motion } from "framer-motion";
import { categories, type CategoryValue } from "@/lib/data/products";

interface CategoryFilterProps {
  activeCategory: CategoryValue;
  onCategoryChange: (category: CategoryValue) => void;
}

export function CategoryFilter({
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-3 mb-8 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onCategoryChange(cat.value)}
          className={`relative px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 active:scale-95 ${
            activeCategory === cat.value
              ? "text-primary-foreground shadow-md shadow-primary/10"
              : "bg-secondary text-accent hover:bg-secondary/80"
          }`}
        >
          {activeCategory === cat.value && (
            <motion.div
              layoutId="activeCategory"
              className="absolute inset-0 bg-primary rounded-full"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10 font-headline font-bold">
            {cat.label}
          </span>
        </button>
      ))}
    </div>
  );
}
