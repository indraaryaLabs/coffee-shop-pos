"use client";
import { useState } from "react";
import { toast } from "sonner";

import { motion } from "framer-motion";
import { TopNav } from "@/components/layout/TopNav";
import { ReportSummary } from "@/components/reports/ReportSummary";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { TransactionTable } from "@/components/reports/TransactionTable";
import { VolumeTrends } from "@/components/reports/VolumeTrends";
import { PopularCategory } from "@/components/reports/PopularCategory";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <TopNav
        searchPlaceholder="Search transactions by ID or customer..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className="pt-24 px-8 pb-12 font-sans min-h-screen">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-accent font-bold tracking-[0.2em] uppercase text-xs mb-2">
              Performance Metrics
            </p>
            <h2 className="font-headline text-5xl font-extrabold text-foreground tracking-tight">
              Reports & History
            </h2>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => toast("Exporting PDF...", { description: "Your PDF is being generated." })}
              className="flex items-center gap-2 px-6 py-6 bg-card text-muted-foreground rounded-xl font-medium shadow-sm border border-border hover:bg-secondary transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">
                picture_as_pdf
              </span>
              Export PDF
            </Button>
            <Button
              className="flex items-center gap-2 px-6 py-6 bg-foreground text-background rounded-xl font-medium shadow-md hover:opacity-90 transition-all active:scale-95"
              onClick={() => toast("Exporting CSV...", { description: "Download started." })}
            >
              <span className="material-symbols-outlined text-xl">csv</span>
              Download CSV
            </Button>
          </div>
        </div>

        <ReportSummary />
        <ReportFilters />
        <TransactionTable searchQuery={searchQuery} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="md:col-span-2">
            <VolumeTrends />
          </div>
          <div>
            <PopularCategory />
          </div>
        </motion.div>
      </main>
    </>
  );
}
