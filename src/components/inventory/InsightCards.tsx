"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function InsightCards() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <div className="lg:col-span-2 p-8 rounded-2xl bg-secondary border border-border relative overflow-hidden group hover:shadow-md transition-all">
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <h4 className="font-headline text-xl font-extrabold text-foreground mb-2">
              Automated Reorder Point
            </h4>
            <p className="text-sm text-foreground/70 max-w-md leading-relaxed">
              Predictive ordering is active for core items. Your next shipment
              from Atlas Coffee Importers is scheduled for arrival on{" "}
              <b className="font-bold text-foreground">Tuesday, Oct 24th</b>.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <button className="text-xs font-bold uppercase tracking-widest text-accent border-b-2 border-accent py-1">
              View Schedule
            </button>
            <button className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 py-1 hover:text-accent transition-colors">
              Adjust Thresholds
            </button>
          </div>
        </div>
        <span className="absolute -right-4 -bottom-4 material-symbols-outlined text-[160px] text-accent/5 group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-500 pointer-events-none">
          local_shipping
        </span>
      </div>

      <div className="p-8 rounded-2xl bg-foreground text-background flex flex-col justify-between group overflow-hidden relative">
        <div className="relative z-10">
          <span className="material-symbols-outlined text-3xl mb-4 text-background/80">
            receipt_long
          </span>
          <h4 className="font-headline text-lg font-bold">Inventory Audit</h4>
          <p className="text-sm opacity-70 mt-2">
            Last full physical audit was performed 14 days ago.
          </p>
        </div>
        <Button
          variant="secondary"
          className="mt-6 w-full py-6 bg-secondary text-foreground rounded-lg font-bold text-sm hover:brightness-105 transition-all relative z-10 active:scale-95"
        >
          Start New Audit
        </Button>
      </div>
    </motion.div>
  );
}
