"use client";

import { useState, useMemo, useRef } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { TopNav } from "@/components/layout/TopNav";
import { ReportSummary } from "@/components/reports/ReportSummary";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { TransactionTable } from "@/components/reports/TransactionTable";
import { VolumeTrends } from "@/components/reports/VolumeTrends";
import { PopularCategory } from "@/components/reports/PopularCategory";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";

interface ReportsClientProps {
  totalRevenue: number;
  totalOrders: number;
  avgTicket: number;
  transactions: any[];
  volumeData: any[];
  categoryData: any[];
}

export function ReportsClient({ totalRevenue, totalOrders, avgTicket, transactions, volumeData, categoryData }: ReportsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [appliedDateRange, setAppliedDateRange] = useState("all");
  const [appliedPaymentMethod, setAppliedPaymentMethod] = useState("all");

  const handleApplyFilters = () => {
    setAppliedDateRange(dateRange);
    setAppliedPaymentMethod(paymentMethod);
    toast.success("Filters applied!", { description: `Date: ${dateRange}, Payment: ${paymentMethod}` });
  };

  // Filter transactions based on applied filters
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Date range filter
    if (appliedDateRange !== "all") {
      const now = new Date();
      let cutoff = new Date();
      if (appliedDateRange === "today") {
        cutoff.setHours(0, 0, 0, 0);
      } else if (appliedDateRange === "7days") {
        cutoff.setDate(now.getDate() - 7);
      } else if (appliedDateRange === "30days") {
        cutoff.setDate(now.getDate() - 30);
      } else if (appliedDateRange === "90days") {
        cutoff.setDate(now.getDate() - 90);
      }
      filtered = filtered.filter((tx) => {
        // Parse the date string back
        const txDate = new Date(tx.rawDate);
        return txDate >= cutoff;
      });
    }

    // Payment method filter
    if (appliedPaymentMethod !== "all") {
      filtered = filtered.filter((tx) => tx.paymentMethod === appliedPaymentMethod);
    }

    return filtered;
  }, [transactions, appliedDateRange, appliedPaymentMethod]);

  // Recalculate metrics based on filtered data
  const filteredRevenue = filteredTransactions.reduce((sum: number, tx: any) => sum + tx.total, 0);
  const filteredOrders = filteredTransactions.length;
  const filteredAvgTicket = filteredOrders > 0 ? filteredRevenue / filteredOrders : 0;

  const isFiltered = appliedDateRange !== "all" || appliedPaymentMethod !== "all";

  // PDF Export
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Atelier_Transaction_Report",
    onAfterPrint: () => toast.success("PDF Export complete.")
  });

  // CSV Export
  const handleExportCSV = () => {
    toast("Generating CSV...", { description: "Preparing your download." });
    try {
      const headers = ["ID", "Date", "Time", "Customer", "Cashier", "Payment Method", "Amount", "Status"];
      const rows = filteredTransactions.map((tx: any) => [
        tx.id,
        `"${tx.date}"`,
        `"${tx.time}"`,
        `"${tx.customer}"`,
        `"${tx.cashier}"`,
        tx.paymentMethod,
        tx.total.toFixed(2),
        tx.status
      ]);

      const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `Atelier_Export_${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV Downloaded successfully.");
    } catch (error) {
      toast.error("Failed to generate CSV.");
    }
  };

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
              onClick={() => handlePrint()}
              className="flex items-center gap-2 px-6 py-6 bg-card text-muted-foreground rounded-xl font-medium shadow-sm border border-border hover:bg-secondary transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">
                picture_as_pdf
              </span>
              Export PDF
            </Button>
            <Button
              className="flex items-center gap-2 px-6 py-6 bg-foreground text-background rounded-xl font-medium shadow-md hover:opacity-90 transition-all active:scale-95"
              onClick={handleExportCSV}
            >
              <span className="material-symbols-outlined text-xl">csv</span>
              Download CSV
            </Button>
          </div>
        </div>

        <ReportSummary
          totalRevenue={isFiltered ? filteredRevenue : totalRevenue}
          totalOrders={isFiltered ? filteredOrders : totalOrders}
          avgTicket={isFiltered ? filteredAvgTicket : avgTicket}
        />

        <ReportFilters
          dateRange={dateRange}
          paymentMethod={paymentMethod}
          onDateRangeChange={setDateRange}
          onPaymentMethodChange={setPaymentMethod}
          onApply={handleApplyFilters}
        />

        <div ref={printRef} className="print:p-8 print:bg-white print:text-black">
          <TransactionTable searchQuery={searchQuery} items={filteredTransactions} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="md:col-span-2">
            <VolumeTrends data={volumeData} />
          </div>
          <div>
            <PopularCategory data={categoryData} />
          </div>
        </motion.div>
      </main>
    </>
  );
}
