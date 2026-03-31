"use client";

import { useState } from "react";
import { toast } from "sonner";
import { TopNav } from "@/components/layout/TopNav";
import { InventoryStats } from "@/components/inventory/InventoryStats";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { InsightCards } from "@/components/inventory/InsightCards";
import { Button } from "@/components/ui/button";
import { useInventoryStore } from "@/hooks/use-inventory";
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

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<"raw" | "recipes">("raw");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { items, addItem, restockItem } = useInventoryStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    subtitle: "",
    currentStock: 0 as number | "",
    unit: "Kilograms",
    pricePerUnit: "",
    supplier: "",
    image: "",
  });

  const [restockForm, setRestockForm] = useState({
    id: "",
    qty: 10,
  });

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockForm.id) {
      toast.error("Please select an item");
      return;
    }
    restockItem(restockForm.id, restockForm.qty);
    toast.success("Inventory restocked successfully!");
    setIsRestockOpen(false);
    setRestockForm({ id: "", qty: 10 });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm({ ...form, image: url });
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.currentStock === "") return;

    addItem({
      ...form,
      currentStock: Number(form.currentStock),
    });
    
    setIsAddOpen(false);
    toast.success("New item added successfully!");
    setForm({
      name: "",
      subtitle: "",
      currentStock: 0,
      unit: "Kilograms",
      pricePerUnit: "",
      supplier: "",
      image: "",
    });
  };

  return (
    <>
      <TopNav
        title="Inventory"
        subtitle="Live Stock"
        searchPlaceholder="Search resources..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className="pt-16 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header Actions & Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-4">
              <h2 className="font-headline text-3xl font-extrabold text-foreground tracking-tight">
                Inventory Management
              </h2>
              <div className="flex p-1 bg-card border border-border rounded-xl w-fit shadow-sm">
                <button
                  onClick={() => setActiveTab("raw")}
                  className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                    activeTab === "raw"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-accent font-medium hover:text-foreground hover:bg-background/20"
                  }`}
                >
                  Raw Materials
                </button>
                <button
                  onClick={() => setActiveTab("recipes")}
                  className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                    activeTab === "recipes"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-accent font-medium hover:text-foreground hover:bg-background/20"
                  }`}
                >
                  Product Recipes
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
                <DialogTrigger className="flex items-center gap-2 px-5 py-5 rounded-lg bg-card text-accent font-semibold text-sm hover:bg-primary/10 transition-all border-border active:scale-95 border shadow-sm cursor-pointer">
                  <span className="material-symbols-outlined text-sm">
                    refresh
                  </span>
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
                          {items.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name} ({item.currentStock} {item.unit})
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
                      <Button type="submit" className="w-full">
                        Confirm Restock
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger className="flex items-center gap-2 px-6 py-5 rounded-lg bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-all active:scale-95 shadow-md cursor-pointer">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add New Item
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Inventory Item</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddItem} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Image Upload</label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file:border-0 file:bg-transparent file:text-sm file:font-medium text-muted-foreground w-full flex items-center p-2 h-auto"
                      />
                      {form.image && (
                        <div className="mt-2 w-16 h-16 rounded-lg overflow-hidden border border-border">
                          <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Item Name</label>
                      <Input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Ethiopian Yirgacheffe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Category/Description</label>
                      <Input
                        required
                        value={form.subtitle}
                        onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                        placeholder="e.g. Whole Bean Roast"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Current Stock</label>
                        <Input
                          type="number"
                          required
                          value={form.currentStock}
                          onChange={(e) => setForm({ ...form, currentStock: e.target.value === "" ? "" : Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Unit</label>
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          value={form.unit}
                          onChange={(e) => setForm({ ...form, unit: e.target.value })}
                        >
                          <option value="Kilograms">Kilograms (kg)</option>
                          <option value="Liters">Liters (L)</option>
                          <option value="Bottles">Bottles</option>
                          <option value="Cans">Cans</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Price per Unit</label>
                        <Input
                          required
                          value={form.pricePerUnit}
                          onChange={(e) => setForm({ ...form, pricePerUnit: e.target.value })}
                          placeholder="$28.00 / kg"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Supplier</label>
                        <Input
                          required
                          value={form.supplier}
                          onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                          placeholder="Atlas Coffee..."
                        />
                      </div>
                    </div>
                    <DialogFooter className="pt-4">
                      <Button type="submit" className="w-full">
                        Add to Inventory
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <InventoryStats />
          <InventoryTable searchQuery={searchQuery} />
          <InsightCards />
        </div>
      </main>
    </>
  );
}
