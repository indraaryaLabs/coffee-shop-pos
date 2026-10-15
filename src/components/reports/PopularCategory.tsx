"use client";

import Link from "next/link";

interface PopularCategoryProps {
  data?: any[];
}

export function PopularCategory({ data = [] }: PopularCategoryProps) {
  const displayData = data.length > 0 ? data : [
    { icon: "coffee", label: "Specialty Lattes", pct: "42%" },
    { icon: "bakery_dining", label: "Artisan Pastries", pct: "28%" },
    { icon: "lunch_dining", label: "Savory Sandwiches", pct: "18%" },
    { icon: "icecream", label: "Seasonal Items", pct: "12%" },
  ];

  return (
    <div className="bg-accent/10 rounded-[2rem] p-8 h-full flex flex-col border border-accent/20 group hover:shadow-sm transition-all">
      <h4 className="font-headline text-xl font-bold text-foreground mb-6">
        Popular Category
      </h4>
      <div className="space-y-6 flex-1">
        {displayData.map((item, i) => (
          <div key={i} className="flex items-center justify-between group/item">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-accent group-hover/item:scale-110 transition-transform">
                {item.icon}
              </span>
              <span className="text-sm font-semibold text-foreground">
                {item.label}
              </span>
            </div>
            <span className="text-sm font-bold text-foreground">
              {item.pct}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-8 pt-6 border-t border-accent/20 text-center">
        <Link
          href="#"
          className="text-xs font-bold text-accent uppercase tracking-widest hover:underline hover:text-foreground transition-all"
        >
          View All Category Stats
        </Link>
      </div>
    </div>
  );
}
