"use client";

import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

interface InventoryStatsProps {
  lowStockCount: number;
  totalValue: number;
}

export function InventoryStats({ lowStockCount, totalValue }: InventoryStatsProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
    >
      <motion.div variants={item} className="col-span-1 p-6 bg-card rounded-xl shadow-sm border border-border flex flex-col justify-between hover:shadow-md transition-shadow">
        <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
          Low Stock Items
        </span>
        <div className="flex items-end justify-between mt-4">
          <span className="font-headline text-4xl font-extrabold text-destructive">
            {lowStockCount.toString().padStart(2, '0')}
          </span>
          <div className="p-2 bg-destructive/10 rounded-lg">
            <span className="material-symbols-outlined text-destructive">
              warning
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="col-span-1 p-6 bg-card rounded-xl shadow-sm border border-border flex flex-col justify-between hover:shadow-md transition-shadow">
        <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
          Total Value
        </span>
        <div className="flex items-end justify-between mt-4">
          <span className="font-headline text-3xl font-extrabold text-foreground tracking-tight">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          <div className="p-2 bg-primary/10 rounded-lg">
            <span className="material-symbols-outlined text-primary">
              payments
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="col-span-2 p-6 bg-accent rounded-xl flex items-center justify-between text-accent-foreground shadow-md hover:shadow-lg transition-shadow relative overflow-hidden group">
        <div className="space-y-1 relative z-10">
          <p className="font-bold">Stock Insights</p>
          <p className="text-sm opacity-80 max-w-xs leading-relaxed">
            {lowStockCount > 0
              ? `You have ${lowStockCount} items running low. Consider restocking soon.`
              : "All inventory levels are healthy. No restocking needed."}
          </p>
        </div>
        <span className="material-symbols-outlined text-5xl opacity-20 absolute right-6 group-hover:scale-110 transition-transform">
          auto_awesome
        </span>
      </motion.div>
    </motion.div>
  );
}
