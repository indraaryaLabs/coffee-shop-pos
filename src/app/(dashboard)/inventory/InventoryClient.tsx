"use client";

import { useState } from "react";
import { toast } from "sonner";
import { TopNav } from "@/components/layout/TopNav";
import { InventoryStats } from "@/components/inventory/InventoryStats";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { InsightCards } from "@/components/inventory/InsightCards";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { createProduct } from "@/lib/actions/product";
import { restockProduct } from "@/lib/actions/inventory";

interface InventoryClientProps {
  initialItems: any[];
  rawMaterials: any[];
}

export function InventoryClient({ initialItems, rawMaterials }: InventoryClientProps) {
  const [activeTab, setActiveTab] = useState<"retail" | "raw_material">("retail");
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    currentStock: 0 as number | "",
    price: "",
    type: "retail" as "retail" | "raw_material",
  });

  const [restockForm, setRestockForm] = useState({
    id: "",
    qty: 10,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  // Filter items by active tab
  const retailItems = initialItems.filter((i) => i.productType === "retail");
  const rawItems = initialItems.filter((i) => i.productType === "raw_material");
  const displayItems = activeTab === "retail" ? retailItems : rawItems;

  // Compute stats from all items (retail + raw_material)
  const lowStockCount = initialItems.filter(
    (i) => i.status === "low_stock" || i.status === "out_of_stock"
  ).length;
  const totalValue = initialItems.reduce((acc: number, item: any) => {
    const priceStr = String(item.pricePerUnit || "0").replace(/[^0-9.]/g, "");
    const price = parseFloat(priceStr) || 0;
    return acc + price * (item.currentStock || 0);
  }, 0);

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockForm.id) {
      toast.error("Please select an item");
      return;
    }
    setIsLoading(true);
    const result = await restockProduct(restockForm.id, restockForm.qty);
    setIsLoading(false);

    if (result.success) {
      toast.success("Restocked successfully!");
      setIsRestockOpen(false);
      setRestockForm({ id: "", qty: 10 });
    } else {
      toast.error(result.error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("price", form.price.toString());
    formData.append("initialStock", (form.currentStock || 0).toString());
    formData.append("type", form.type);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const result = await createProduct(formData);
    setIsLoading(false);

    if (result.success) {
      toast.success(`New ${form.type === "raw_material" ? "raw material" : "product"} added!`);
      setIsAddOpen(false);
      setForm({ name: "", category: "", currentStock: 0, price: "", type: "retail" });
      setImageFile(null);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <>
      <TopNav
        title="Inventory"
        subtitle="Live Database Stock"
        searchPlaceholder="Search database..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className="pt-16 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header Actions & Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-4">
              <h2 className="font-headline text-3xl font-extrabold text-foreground tracking-tight">
                Inventory Database
              </h2>
              <div className="flex p-1 bg-card border border-border rounded-xl w-fit shadow-sm">
                <button
                  onClick={() => setActiveTab("retail")}
                  className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                    activeTab === "retail"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-accent font-medium hover:text-foreground hover:bg-background/20"
                  }`}
                >
                  Products
                </button>
                <button
                  onClick={() => setActiveTab("raw_material")}
                  className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                    activeTab === "raw_material"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-accent font-medium hover:text-foreground hover:bg-background/20"
                  }`}
                >
                  Raw Materials
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Restock Dialog */}
              <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
                <DialogTrigger className="flex items-center gap-2 px-5 py-5 rounded-lg bg-card text-accent font-semibold text-sm hover:bg-primary/10 transition-all border-border active:scale-95 border shadow-sm cursor-pointer">
                  <span className="material-symbols-outlined text-sm">inventory_2</span>
                  Restock
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Restock Item</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleRestockSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Select Item</label>
                      <Select
                        value={restockForm.id}
                        onValueChange={(val) => setRestockForm({ ...restockForm, id: val })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an inventory item..." />
                        </SelectTrigger>
                        <SelectContent>
                          {initialItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name} ({item.currentStock} in stock)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Quantity to Add</label>
                      <Input
                        type="number"
                        min="1"
                        required
                        value={restockForm.qty}
                        onChange={(e) => setRestockForm({ ...restockForm, qty: Number(e.target.value) })}
                      />
                    </div>
                    <DialogFooter className="pt-4">
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Restocking..." : "Confirm Restock"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Add New Item Dialog */}
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger className="flex items-center gap-2 px-6 py-5 rounded-lg bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-all active:scale-95 shadow-md cursor-pointer">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add New Item
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add to Inventory</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddItem} className="space-y-4 py-4">
                    {/* Item Type Selector */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Item Type</label>
                      <Select
                        value={form.type}
                        onValueChange={(val: any) => setForm({ ...form, type: val })}
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
                      <label className="text-sm font-bold">Image Upload</label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file:border-0 file:bg-transparent file:text-sm file:font-medium text-muted-foreground w-full flex items-center p-2 h-auto"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Item Name</label>
                      <Input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={form.type === "raw_material" ? "e.g. Espresso Beans" : "e.g. Bottled Cold Brew"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Category</label>
                      <Input
                        required
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        placeholder={form.type === "raw_material" ? "e.g. beans, dairy, syrup" : "e.g. bottled, merchandise"}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Initial Stock</label>
                        <Input
                          type="number"
                          required
                          value={form.currentStock}
                          onChange={(e) => setForm({ ...form, currentStock: e.target.value === "" ? "" : Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Price ($)</label>
                        <Input
                          type="number"
                          step="0.01"
                          required
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: e.target.value })}
                          placeholder="28.00"
                        />
                      </div>
                    </div>
                    <DialogFooter className="pt-4">
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Adding..." : `Add ${form.type === "raw_material" ? "Raw Material" : "Product"}`}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <InventoryStats lowStockCount={lowStockCount} totalValue={totalValue} />
          <InventoryTable searchQuery={searchQuery} items={displayItems} />
          <InsightCards />
        </div>
      </main>
    </>
  );
}
