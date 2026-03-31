"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Product } from "@/lib/data/products";
import { useCartStore } from "@/hooks/use-cart";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => addItem(product)}
      className="group relative flex flex-col text-left bg-card rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-border active:scale-[0.98]"
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        {!imgError ? (
          <Image
            unoptimized
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-500">
            <span className="text-5xl font-headline font-extrabold text-muted-foreground/30">
              {product.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {product.badge && (
          <span className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold font-headline">
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-headline font-bold text-lg text-foreground">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          {product.description}
        </p>
        <div className="flex justify-between items-end">
          <span className="text-xl font-bold font-headline text-foreground">
            ${product.price.toFixed(2)}
          </span>
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
            <span className="material-symbols-outlined text-xl">add</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
