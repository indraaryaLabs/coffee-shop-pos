"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function ReportFilters() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-secondary rounded-[2rem] p-6 mb-8 flex flex-wrap items-center gap-6"
    >
      <div className="flex-1 min-w-[240px]">
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 ml-1">
          Date Range
        </label>
        <div className="flex items-center bg-card rounded-xl px-4 py-2.5 border border-border">
          <span className="material-symbols-outlined text-muted-foreground mr-3 text-lg">
            calendar_today
          </span>
          <span className="text-sm font-medium text-foreground">
            Oct 12, 2023 - Oct 19, 2023
          </span>
          <span className="material-symbols-outlined ml-auto text-muted-foreground/50">
            expand_more
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 ml-1">
          Payment Method
        </label>
        <div className="flex items-center bg-card rounded-xl px-4 py-2.5 border border-border">
          <span className="material-symbols-outlined text-muted-foreground mr-3 text-lg">
            payments
          </span>
          <span className="text-sm font-medium text-foreground">
            All Methods
          </span>
          <span className="material-symbols-outlined ml-auto text-muted-foreground/50">
            expand_more
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 ml-1">
          Cashier
        </label>
        <div className="flex items-center bg-card rounded-xl px-4 py-2.5 border border-border">
          <span className="material-symbols-outlined text-muted-foreground mr-3 text-lg">
            badge
          </span>
          <span className="text-sm font-medium text-foreground">
            All Baristas
          </span>
          <span className="material-symbols-outlined ml-auto text-muted-foreground/50">
            expand_more
          </span>
        </div>
      </div>
      <div className="flex items-end self-end h-[46px]">
        <Button className="bg-accent text-accent-foreground px-8 h-full rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2 active:scale-95">
          <span className="material-symbols-outlined">filter_list</span>
          Apply
        </Button>
      </div>
    </motion.div>
  );
}
