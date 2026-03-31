"use client";

import Image from "next/image";
import { topSellers } from "@/lib/data/transactions";
import { Button } from "@/components/ui/button";

export function TopSellers() {
  return (
    <div className="bg-card rounded-xl p-8 shadow-sm border border-border flex flex-col h-full">
      <h4 className="font-headline text-xl font-bold text-foreground mb-6">
        Top Sellers
      </h4>
      <div className="space-y-6 flex-1">
        {topSellers.map((item, index) => (
          <div key={index} className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative border border-border">
              <Image
                unoptimized
                src={item.image}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-foreground">
                {item.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.sold} sold today
              </p>
            </div>
            <p className="font-headline font-bold text-primary text-sm">
              ${item.revenue.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <Button
        variant="secondary"
        className="w-full mt-8 py-6 bg-secondary text-foreground text-xs font-bold rounded-lg hover:bg-primary/20 transition-all uppercase tracking-widest active:scale-95"
      >
        View Full Inventory
      </Button>
    </div>
  );
}
