"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportFiltersProps {
  dateRange: string;
  paymentMethod: string;
  onDateRangeChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
  onApply: () => void;
}

export function ReportFilters({
  dateRange,
  paymentMethod,
  onDateRangeChange,
  onPaymentMethodChange,
  onApply,
}: ReportFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-secondary rounded-[2rem] p-6 mb-8 flex flex-wrap items-end gap-6"
    >
      <div className="flex-1 min-w-[240px]">
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 ml-1">
          Date Range
        </label>
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="bg-card rounded-xl border-border h-11">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-muted-foreground text-lg">
                calendar_today
              </span>
              <SelectValue placeholder="Select date range" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 ml-1">
          Payment Method
        </label>
        <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
          <SelectTrigger className="bg-card rounded-xl border-border h-11">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-muted-foreground text-lg">
                payments
              </span>
              <SelectValue placeholder="All Methods" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="qr_code">QR Code</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button
          onClick={onApply}
          className="bg-accent text-accent-foreground px-8 h-11 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2 active:scale-95"
        >
          <span className="material-symbols-outlined">filter_list</span>
          Apply
        </Button>
      </div>
    </motion.div>
  );
}
