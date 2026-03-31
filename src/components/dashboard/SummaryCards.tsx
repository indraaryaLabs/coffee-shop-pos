"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function SummaryCards() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
    >
      {/* Revenue Card */}
      <motion.div
        variants={item}
        className="bg-card p-8 rounded-xl shadow-sm flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300 border border-border"
      >
        <div className="flex justify-between items-start">
          <div className="p-3 bg-secondary text-primary rounded-xl">
            <span className="material-symbols-outlined material-symbols-filled">
              payments
            </span>
          </div>
          <span className="text-primary font-bold text-sm">
            +12% vs yesterday
          </span>
        </div>
        <div className="mt-6">
          <p className="text-muted-foreground font-medium text-sm uppercase tracking-widest">
            Revenue Today
          </p>
          <h3 className="font-headline text-4xl font-extrabold text-foreground mt-2 tracking-tight">
            $3,482.50
          </h3>
        </div>
      </motion.div>

      {/* Cups Sold Card */}
      <motion.div
        variants={item}
        className="bg-card p-8 rounded-xl shadow-sm flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300 border border-border"
      >
        <div className="flex justify-between items-start">
          <div className="p-3 bg-secondary text-accent rounded-xl">
            <span className="material-symbols-outlined material-symbols-filled">
              coffee
            </span>
          </div>
          <span className="text-muted-foreground font-medium text-sm">
            Target: 450
          </span>
        </div>
        <div className="mt-6">
          <p className="text-muted-foreground font-medium text-sm uppercase tracking-widest">
            Cups Sold
          </p>
          <h3 className="font-headline text-4xl font-extrabold text-foreground mt-2 tracking-tight">
            412
          </h3>
        </div>
      </motion.div>

      {/* Low Stock Card */}
      <motion.div
        variants={item}
        className="bg-card p-8 rounded-xl shadow-sm border-l-4 border-l-primary flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300"
      >
        <div className="flex justify-between items-start">
          <div className="p-3 bg-secondary text-accent rounded-xl">
            <span className="material-symbols-outlined material-symbols-filled">
              warning
            </span>
          </div>
          <Link
            href="/inventory"
            className="text-accent font-bold text-xs underline underline-offset-4 uppercase tracking-tighter hover:text-foreground transition-colors"
          >
            Restock Now
          </Link>
        </div>
        <div className="mt-6">
          <p className="text-muted-foreground font-medium text-sm uppercase tracking-widest">
            Low Stock Alerts
          </p>
          <h3 className="font-headline text-4xl font-extrabold text-foreground mt-2 tracking-tight">
            04 <span className="text-lg font-medium text-muted-foreground">Items</span>
          </h3>
        </div>
      </motion.div>
    </motion.div>
  );
}
