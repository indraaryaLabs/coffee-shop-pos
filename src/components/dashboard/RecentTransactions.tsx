"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

interface RecentTransactionsProps {
  transactions?: any[];
}

type FilterStatus = "all" | "completed" | "pending" | "cancelled";
type FilterPayment = "all" | "cash" | "card" | "qr_code";

export function RecentTransactions({ transactions = [] }: RecentTransactionsProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [paymentFilter, setPaymentFilter] = useState<FilterPayment>("all");

  // Filter logic
  const filteredTx = useMemo(() => {
    return transactions.filter((tx) => {
      const matchStatus = statusFilter === "all" || tx.status === statusFilter;
      const matchPayment = paymentFilter === "all" || tx.paymentMethod === paymentFilter;
      return matchStatus && matchPayment;
    });
  }, [transactions, statusFilter, paymentFilter]);

  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) + (paymentFilter !== "all" ? 1 : 0);

  // CSV Export
  const handleExportCSV = useCallback(() => {
    if (filteredTx.length === 0) return;

    const headers = ["Transaction ID", "Customer", "Payment Method", "Status", "Total", "Date"];
    const rows = filteredTx.map((tx) => [
      tx.id.substring(0, 8).toUpperCase(),
      tx.customerName || "Guest",
      tx.paymentMethod.toUpperCase(),
      tx.status,
      Number(tx.totalAmount).toFixed(2),
      tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "-",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell: string) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `transactions_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredTx]);

  const clearFilters = () => {
    setStatusFilter("all");
    setPaymentFilter("all");
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="px-8 py-6 flex justify-between items-center bg-secondary/30">
        <h4 className="font-headline text-xl font-bold text-foreground">
          Recent Transactions
        </h4>
        <div className="flex gap-4 items-center">
          {/* Filter Button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilter(!showFilter)}
              className={`text-muted-foreground hover:text-foreground transition-all relative ${
                showFilter ? "bg-secondary text-foreground" : ""
              }`}
            >
              <span className="material-symbols-outlined">filter_list</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          {/* Export CSV Button */}
          <Button
            onClick={handleExportCSV}
            disabled={filteredTx.length === 0}
            className="bg-foreground text-background px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-accent hover:text-accent-foreground transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-sm mr-1">download</span>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-8 py-5 bg-secondary/20 border-b border-border flex flex-wrap items-center gap-6">
              {/* Status filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Status:
                </span>
                <div className="flex gap-1">
                  {(["all", "completed", "pending", "cancelled"] as FilterStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                        statusFilter === s
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-card/40"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Payment:
                </span>
                <div className="flex gap-1">
                  {(["all", "cash", "card", "qr_code"] as FilterPayment[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPaymentFilter(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        paymentFilter === p
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-card/40"
                      }`}
                    >
                      {p === "qr_code" ? "QR Code" : p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear all */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-primary hover:text-foreground transition-colors ml-auto flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                  Clear Filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 text-muted-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-secondary/50">
              <TableHead className="px-8 py-4 h-auto min-w-[120px]">
                Transaction ID
              </TableHead>
              <TableHead className="px-8 py-4 h-auto min-w-[150px]">
                Customer
              </TableHead>
              <TableHead className="px-8 py-4 h-auto min-w-[250px]">
                Payment
              </TableHead>
              <TableHead className="px-8 py-4 h-auto">Status</TableHead>
              <TableHead className="px-8 py-4 h-auto text-right">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTx.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                   {transactions.length === 0
                     ? "No transactions available."
                     : "No transactions match the current filters."}
                 </TableCell>
               </TableRow>
            ) : filteredTx.map((tx) => (
              <TableRow
                key={tx.id}
                className="hover:bg-secondary/20 transition-colors group border-b-secondary"
              >
                <TableCell className="px-8 py-5 text-sm font-medium text-foreground">
                  {tx.id.substring(0, 8).toUpperCase()}
                </TableCell>
                <TableCell className="px-8 py-5 text-sm font-semibold text-foreground">
                  {tx.customerName || "Guest"}
                </TableCell>
                <TableCell className="px-8 py-5 text-xs text-foreground/80 truncate max-w-[200px]">
                  {tx.paymentMethod.toUpperCase()}
                </TableCell>
                <TableCell className="px-8 py-5">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tight border-none ${
                      tx.status === "completed"
                        ? "bg-primary/10 text-primary"
                        : tx.status === "pending"
                        ? "bg-accent/10 text-accent"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-8 py-5 text-right font-headline font-bold text-foreground">
                  ${Number(tx.totalAmount).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="px-8 py-6 text-center border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Showing {filteredTx.length} of {transactions.length} transactions
        </span>
        <Link href="/reports">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground font-bold text-xs uppercase tracking-widest transition-all"
          >
            View All Transactions
          </Button>
        </Link>
      </div>
    </div>
  );
}
