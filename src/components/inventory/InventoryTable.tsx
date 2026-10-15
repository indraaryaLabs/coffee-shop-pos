"use client";

import Image from "next/image";
import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { toast } from "sonner";
import { deleteProduct } from "@/lib/actions/inventory";
import { editProduct } from "@/lib/actions/product";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InventoryTableProps {
  searchQuery?: string;
  items?: any[];
}

export function InventoryTable({ searchQuery = "", items = [] }: InventoryTableProps) {
  const [parent] = useAutoAnimate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Edit Dialog State
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    price: "",
    currentStock: 0 as number | "",
    type: "retail" as "retail" | "raw_material" | "menu",
    imageUrl: "",
  });

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.supplier || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"? This cannot be undone.`)) return;
    
    setDeletingId(id);
    const result = await deleteProduct(id);
    setDeletingId(null);

    if (result.success) {
      toast.success(`"${name}" deleted successfully.`);
    } else {
      toast.error(result.error);
    }
  };

  const handleEditClick = (item: any) => {
    // Strip $ from price and construct initial state
    const priceRaw = String(item.pricePerUnit).replace(/[^0-9.]/g, "");
    setEditForm({
      name: item.name || "",
      category: item.subtitle || "",
      price: priceRaw || "",
      currentStock: item.currentStock ?? 0,
      type: item.productType || "retail",
      imageUrl: item.image || "",
    });
    setImageFile(null);
    setEditingItem(item);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSaving(true);
    const formData = new FormData();
    formData.append("id", editingItem.id);
    formData.append("name", editForm.name);
    formData.append("category", editForm.category);
    formData.append("price", editForm.price);
    formData.append("currentStock", String(editForm.currentStock || 0));
    formData.append("type", editForm.type);
    
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const result = await editProduct(formData);
    setIsSaving(false);

    if (result.success) {
      toast.success(`"${editForm.name}" updated successfully.`);
      setIsEditOpen(false);
      setEditingItem(null);
    } else {
      toast.error(result.error || "Failed to update item.");
    }
  };

  return (
    <div className="bg-card shadow-sm rounded-2xl overflow-hidden border border-border">
      <div className="p-6 bg-secondary flex items-center justify-between border-b border-border">
        <h3 className="font-headline font-bold text-foreground">
          Current Inventory
        </h3>
        <span className="text-xs text-muted-foreground font-medium">
          {filteredItems.length} items
        </span>
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
              <TableHead className="px-6 py-4 h-auto min-w-[100px]">
                Type
              </TableHead>
              <TableHead className="px-8 py-4 h-auto text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody ref={parent}>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No items found.
                </TableCell>
              </TableRow>
            ) : filteredItems.map((item) => (
              <TableRow
                key={item.id}
                className="group hover:bg-secondary/40 transition-colors border-b-border"
              >
                <TableCell className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-card overflow-hidden flex items-center justify-center border border-border relative flex-shrink-0">
                      <Image
                        unoptimized
                        src={item.image || "/images/placeholder.jpg"}
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
                        item.status === "low_stock" || item.status === "out_of_stock"
                          ? "text-destructive"
                          : "text-foreground"
                      }`}
                    >
                      {item.currentStock}
                    </span>
                    <span className="text-[10px] uppercase text-muted-foreground">
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
                        : item.status === "low_stock"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {(item.status || "").replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-5 text-muted-foreground font-medium text-sm">
                  {item.pricePerUnit}
                </TableCell>
                <TableCell className="px-6 py-5">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                      item.productType === "raw_material"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-primary/10 text-accent"
                    }`}
                  >
                    {item.productType === "raw_material" ? "Raw Material" : "Product"}
                  </Badge>
                </TableCell>
                <TableCell className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground/60 hover:text-accent transition-colors"
                      onClick={() => handleEditClick(item)}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        edit
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deletingId === item.id}
                      className="text-muted-foreground/60 hover:text-destructive transition-colors"
                      onClick={() => handleDelete(item.id, item.name)}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {deletingId === item.id ? "hourglass_empty" : "delete"}
                      </span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="px-8 py-4 bg-secondary border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-medium">
          Showing {filteredItems.length} of {items.length} items
        </p>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Item Name</label>
              <Input
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Item Type</label>
              <Select
                value={editForm.type}
                onValueChange={(val: any) => setEditForm({ ...editForm, type: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Product (Sell in POS)</SelectItem>
                  <SelectItem value="raw_material">Raw Material (Ingredient)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Category</label>
              <Input
                required
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Product Image</label>
              {editForm.imageUrl && !imageFile && (
                <div className="mb-2 relative w-16 h-16 rounded-xl overflow-hidden border border-border">
                  <Image unoptimized src={editForm.imageUrl} alt="Current" fill className="object-cover" />
                </div>
              )}
              <Input
                name="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
                className="cursor-pointer file:text-primary file:font-semibold file:bg-primary/10 file:border-0 hover:file:bg-primary/20 file:px-4 file:py-1 file:rounded-xl"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Current Stock</label>
                <Input
                  type="number"
                  required
                  value={editForm.currentStock}
                  onChange={(e) => setEditForm({ ...editForm, currentStock: e.target.value === "" ? "" : Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Price ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
