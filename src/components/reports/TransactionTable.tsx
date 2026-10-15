"use client";

import { motion } from "framer-motion";
import { toast } from "sonner";
import { transactions } from "@/lib/data/transactions";
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

interface TransactionTableProps {
  searchQuery?: string;
  items?: any[];
}

export function TransactionTable({ searchQuery = "", items = [] }: TransactionTableProps) {
  const filteredTransactions = items.filter((tx) =>
    tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card rounded-[2rem] shadow-sm border border-border overflow-hidden"
    >
      <div className="px-8 py-6 border-b border-border">
        <h4 className="font-headline text-lg font-bold text-foreground">
          Transaction History
        </h4>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/30 text-muted-foreground text-[10px] uppercase tracking-widest font-bold hover:bg-secondary/30">
              <TableHead className="px-8 py-4 h-auto min-w-[140px]">
                Transaction ID
              </TableHead>
              <TableHead className="px-8 py-4 h-auto min-w-[150px]">
                Date & Time
              </TableHead>
              <TableHead className="px-8 py-4 h-auto min-w-[180px]">
                Cashier
              </TableHead>
              <TableHead className="px-8 py-4 h-auto min-w-[120px]">
                Method
              </TableHead>
              <TableHead className="px-8 py-4 h-auto text-right min-w-[120px]">
                Total Amount
              </TableHead>
              <TableHead className="px-8 py-4 h-auto w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {filteredTransactions.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No transactions available.</TableCell>
               </TableRow>
            ) : filteredTransactions.map((tx) => (
              <TableRow
                key={tx.id}
                className="hover:bg-secondary/20 transition-colors"
              >
                <TableCell className="px-8 py-5">
                   <span className="font-mono text-xs font-bold text-muted-foreground">
                    {tx.id}
                  </span>
                </TableCell>
                <TableCell className="px-8 py-5">
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">{tx.date}</p>
                    <p className="text-xs text-muted-foreground/60">
                      {tx.time}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-accent flex items-center justify-center text-[10px] font-bold">
                      {tx.cashierInitials}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {tx.cashier.length > 8 ? tx.cashier.substring(0,8) + '...' : tx.cashier}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-5">
                  <Badge
                    variant="secondary"
                    className="bg-secondary/80 text-foreground text-[10px] font-bold uppercase tracking-wider border-none"
                  >
                    {tx.paymentMethod.toUpperCase().replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="px-8 py-5 text-right font-headline font-bold text-foreground">
                  ${tx.total.toFixed(2)}
                </TableCell>
                <TableCell className="px-8 py-5 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground/40 hover:text-accent transition-colors w-8 h-8 rounded-full"
                    onClick={() => toast("Transaction Options", { description: `Viewing details for ${tx.id}` })}
                  >
                    <span className="material-symbols-outlined self-center text-lg">
                      more_vert
                    </span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground/60">
          Showing <span className="font-bold text-foreground">All</span> of{" "}
          {items.length} transactions
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-xl hover:bg-secondary transition-all text-muted-foreground border-border"
          >
            <span className="material-symbols-outlined text-xl">
              chevron_left
            </span>
          </Button>
          <Button className="w-10 h-10 rounded-xl bg-foreground text-background font-bold shadow-sm">
            1
          </Button>
          <Button
            variant="outline"
            className="w-10 h-10 rounded-xl hover:bg-secondary transition-all text-muted-foreground border-border p-0"
          >
            2
          </Button>
          <Button
            variant="outline"
            className="w-10 h-10 rounded-xl hover:bg-secondary transition-all text-muted-foreground border-border p-0"
          >
            3
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-xl hover:bg-secondary transition-all text-muted-foreground border-border"
          >
            <span className="material-symbols-outlined text-xl">
              chevron_right
            </span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
