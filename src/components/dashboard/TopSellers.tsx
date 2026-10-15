"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TopSellerItem {
  name: string;
  sold: number;
  revenue: number;
  image: string;
}

export function TopSellers({ items = [] }: { items?: TopSellerItem[] }) {
  return (
    <div className="bg-card rounded-xl p-8 shadow-sm border border-border flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-headline text-xl font-bold text-foreground">
          Top Sellers
        </h4>
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
          All Time
        </span>
      </div>
      <div className="space-y-6 flex-1">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-30">trending_up</span>
            <p className="text-sm font-medium">No sales data yet</p>
            <p className="text-xs">Complete some transactions to see top sellers</p>
          </div>
        ) : (
          items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 group">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary text-xs font-bold text-muted-foreground flex-shrink-0">
                {index + 1}
              </div>
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative border border-border bg-secondary">
                <Image
                  unoptimized
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground truncate">
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.sold} sold
                </p>
              </div>
              <p className="font-headline font-bold text-primary text-sm flex-shrink-0">
                ${item.revenue.toFixed(2)}
              </p>
            </div>
          ))
        )}
      </div>
      <Link href="/inventory">
        <Button
          variant="secondary"
          className="w-full mt-8 py-6 bg-secondary text-foreground text-xs font-bold rounded-lg hover:bg-primary/20 transition-all uppercase tracking-widest active:scale-95"
        >
          View Full Inventory
        </Button>
      </Link>
    </div>
  );
}
