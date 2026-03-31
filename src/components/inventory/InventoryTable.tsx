"use client";

import Image from "next/image";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { toast } from "sonner";
import { useInventoryStore } from "@/hooks/use-inventory";
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

interface InventoryTableProps {
  searchQuery?: string;
}

export function InventoryTable({ searchQuery = "" }: InventoryTableProps) {
  const [parent] = useAutoAnimate();
  const items = useInventoryStore((state) => state.items);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-card shadow-sm rounded-2xl overflow-hidden border border-border">
      <div className="p-6 bg-secondary flex items-center justify-between border-b border-border">
        <h3 className="font-headline font-bold text-foreground">
          Current Inventory
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground transition-all"
          onClick={() => toast("Filter Menu", { description: "Advanced filters opened." })}
        >
          <span className="material-symbols-outlined">filter_list</span>
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold hover:bg-transparent">
              <TableHead className="px-8 py-4 h-auto min-w-[250px]">
                Item Name
              </TableHead>
              <TableHead className="px-6 py-4 h-auto text-center min-w-[120px]">
                Current Stock
              </TableHead>
              <TableHead className="px-6 py-4 h-auto">Status</TableHead>
              <TableHead className="px-6 py-4 h-auto min-w-[120px]">
                Price / Unit
              </TableHead>
              <TableHead className="px-6 py-4 h-auto min-w-[150px]">
                Supplier
              </TableHead>
              <TableHead className="px-8 py-4 h-auto text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody ref={parent}>
            {filteredItems.map((item) => (
              <TableRow
                key={item.id}
                className="group hover:bg-secondary/40 transition-colors border-b-border"
              >
                <TableCell className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-card overflow-hidden flex items-center justify-center border border-border relative flex-shrink-0">
                      <Image
                        unoptimized
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <div className="flex flex-col items-center">
                    <span
                      className={`font-headline font-bold text-lg ${
                        item.status === "low_stock"
                          ? "text-destructive"
                          : "text-foreground"
                      }`}
                    >
                      {item.currentStock.toFixed(1)}
                    </span>
                    <span
                      className={`text-[10px] uppercase ${
                        item.status === "low_stock"
                          ? "text-destructive/60"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.unit}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <Badge
                    variant="outline"
                    className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border-none ${
                      item.status === "in_stock"
                        ? "bg-primary/20 text-accent/80"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {item.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-5 text-muted-foreground font-medium text-sm">
                  {item.pricePerUnit}
                </TableCell>
                <TableCell className="px-6 py-5 text-muted-foreground text-sm">
                  {item.supplier}
                </TableCell>
                <TableCell className="px-8 py-5 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground/60 hover:text-accent transition-colors"
                    onClick={() => toast("Edit Mode", { description: `Editing ${item.name}...` })}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      edit
                    </span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="px-8 py-4 bg-secondary border-t border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
        <p className="text-xs text-muted-foreground font-medium">
          Showing 1-8 of 48 items
        </p>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-lg hover:bg-primary/20 text-muted-foreground hover:text-accent transition-all"
          >
            <span className="material-symbols-outlined text-sm">
              chevron_left
            </span>
          </Button>
          <Button className="w-8 h-8 rounded-lg bg-foreground text-background text-xs font-bold hover:bg-foreground/90">
            1
          </Button>
          <Button
            variant="ghost"
            className="w-8 h-8 p-0 rounded-lg hover:bg-primary/20 text-muted-foreground hover:text-accent transition-all text-xs font-bold"
          >
            2
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-lg hover:bg-primary/20 text-muted-foreground hover:text-accent transition-all"
          >
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
