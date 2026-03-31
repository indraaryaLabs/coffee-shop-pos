"use client";

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
import { transactions } from "@/lib/data/transactions";

export function RecentTransactions() {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="px-8 py-6 flex justify-between items-center bg-secondary/30">
        <h4 className="font-headline text-xl font-bold text-foreground">
          Recent Transactions
        </h4>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground transition-all"
          >
            <span className="material-symbols-outlined">filter_list</span>
          </Button>
          <Button
            className="bg-foreground text-background px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-accent hover:text-accent-foreground transition-all active:scale-95"
          >
            Export CSV
          </Button>
        </div>
      </div>
      
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
                Items
              </TableHead>
              <TableHead className="px-8 py-4 h-auto">Status</TableHead>
              <TableHead className="px-8 py-4 h-auto text-right">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.slice(0, 4).map((tx) => (
              <TableRow
                key={tx.id}
                className="hover:bg-secondary/20 transition-colors group border-b-secondary"
              >
                <TableCell className="px-8 py-5 text-sm font-medium text-foreground">
                  {tx.id}
                </TableCell>
                <TableCell className="px-8 py-5 text-sm font-semibold text-foreground">
                  {tx.customer}
                </TableCell>
                <TableCell className="px-8 py-5 text-xs text-foreground/80 truncate max-w-[200px]">
                  {tx.items}
                </TableCell>
                <TableCell className="px-8 py-5">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tight border-none ${
                      tx.status === "completed"
                        ? "bg-primary/10 text-primary"
                        : tx.status === "processing"
                        ? "bg-accent/10 text-accent"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-8 py-5 text-right font-headline font-bold text-foreground">
                  ${tx.total.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="px-8 py-6 text-center border-t border-border">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground font-bold text-xs uppercase tracking-widest transition-all"
        >
          View All Transactions
        </Button>
      </div>
    </div>
  );
}
