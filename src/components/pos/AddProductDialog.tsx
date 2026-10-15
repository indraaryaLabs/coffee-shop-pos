"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createProduct } from "@/lib/actions/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/data/products";

interface RawMaterial {
  id: string;
  name: string;
  currentStock: number;
  unit: string;
}

interface SelectedIngredient {
  rawMaterialId: string;
  name: string;
  quantityNeeded: number;
  unit: string;
}

interface AddProductDialogProps {
  rawMaterials?: RawMaterial[];
}

export function AddProductDialog({ rawMaterials = [] }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productType, setProductType] = useState<"menu" | "retail">("menu");
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [ingredientSearch, setIngredientSearch] = useState("");

  const filteredMaterials = rawMaterials.filter(
    (m) =>
      m.name.toLowerCase().includes(ingredientSearch.toLowerCase()) &&
      !selectedIngredients.some((s) => s.rawMaterialId === m.id)
  );

  const addIngredient = (material: RawMaterial) => {
    setSelectedIngredients((prev) => [
      ...prev,
      {
        rawMaterialId: material.id,
        name: material.name,
        quantityNeeded: 1,
        unit: material.unit,
      },
    ]);
    setIngredientSearch("");
  };

  const removeIngredient = (id: string) => {
    setSelectedIngredients((prev) => prev.filter((i) => i.rawMaterialId !== id));
  };

  const updateIngredientQty = (id: string, qty: number) => {
    setSelectedIngredients((prev) =>
      prev.map((i) => (i.rawMaterialId === id ? { ...i, quantityNeeded: qty } : i))
    );
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Validate: menu items must have at least 1 ingredient
    if (productType === "menu" && selectedIngredients.length === 0) {
      toast.error("Menu items must have at least 1 ingredient", {
        description: "Please select raw materials used to make this menu item.",
      });
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("type", productType);

    // Add ingredients JSON for menu items
    if (productType === "menu") {
      formData.set(
        "ingredients",
        JSON.stringify(
          selectedIngredients.map((i) => ({
            rawMaterialId: i.rawMaterialId,
            quantityNeeded: i.quantityNeeded,
            unit: i.unit,
          }))
        )
      );
    }

    const res = await createProduct(formData);

    if (res.success) {
      toast.success("Product created successfully!");
      setOpen(false);
      setSelectedIngredients([]);
      setProductType("menu");
    } else {
      toast.error(res.error || "Failed to create product.");
    }

    setLoading(false);
  }

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) {
      setSelectedIngredients([]);
      setProductType("menu");
      setIngredientSearch("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={<Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl mr-2" />}
      >
        <span className="material-symbols-outlined text-sm">add</span>
        Add New Product
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl font-extrabold">
            Add New Product
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-4">
          {/* Product Type Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Product Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setProductType("menu")}
                className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  productType === "menu"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                <span className="material-symbols-outlined text-base">restaurant_menu</span>
                Menu Item
              </button>
              <button
                type="button"
                onClick={() => setProductType("retail")}
                className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  productType === "retail"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                <span className="material-symbols-outlined text-base">inventory_2</span>
                Retail Product
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {productType === "menu"
                ? "Menu items are made from raw materials. You must select the ingredients."
                : "Retail products are sold directly from inventory stock."}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Product Name</label>
            <Input name="name" required placeholder="e.g. Kopi Susu Gula Aren" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Description</label>
            <Input
              name="description"
              required
              placeholder="e.g. Perpaduan kopi robusta dengan gula aren asli"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Category</label>
            <Select name="category" required defaultValue={categories[1].value}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((c) => c.value !== "all")
                  .map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Product Image</label>
            <Input
              name="image"
              type="file"
              accept="image/*"
              className="cursor-pointer file:text-primary file:font-semibold file:bg-primary/10 file:border-0 hover:file:bg-primary/20 file:px-4 file:py-1 file:rounded-xl file:mr-4"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Price ($)</label>
              <Input name="price" type="number" step="0.01" min="0" required placeholder="4.50" />
            </div>
            {productType === "retail" && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Initial Stock</label>
                <Input name="initialStock" type="number" min="0" required placeholder="10" />
              </div>
            )}
          </div>

          {/* Ingredient Picker — only for menu items */}
          {productType === "menu" && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-primary">science</span>
                  Recipe Ingredients
                  <span className="text-destructive">*</span>
                </label>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                  {selectedIngredients.length} selected
                </span>
              </div>

              {/* Selected Ingredients */}
              {selectedIngredients.length > 0 && (
                <div className="space-y-2">
                  {selectedIngredients.map((ing) => (
                    <div
                      key={ing.rawMaterialId}
                      className="flex items-center gap-3 bg-secondary/60 rounded-lg px-3 py-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground flex-1 truncate">
                        {ing.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min="1"
                          value={ing.quantityNeeded}
                          onChange={(e) =>
                            updateIngredientQty(ing.rawMaterialId, Number(e.target.value) || 1)
                          }
                          className="w-16 h-7 text-xs text-center px-1"
                        />
                        <span className="text-[10px] text-muted-foreground font-medium w-8">
                          {ing.unit}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeIngredient(ing.rawMaterialId)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Search & Add Ingredients */}
              <div className="relative">
                <Input
                  placeholder="Search raw materials..."
                  value={ingredientSearch}
                  onChange={(e) => setIngredientSearch(e.target.value)}
                  className="pl-9"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-base">
                  search
                </span>
              </div>

              {ingredientSearch && (
                <div className="bg-card border border-border rounded-lg max-h-40 overflow-y-auto">
                  {filteredMaterials.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-muted-foreground text-center">
                      No raw materials found. Add them in Inventory first.
                    </div>
                  ) : (
                    filteredMaterials.map((mat) => (
                      <button
                        key={mat.id}
                        type="button"
                        onClick={() => addIngredient(mat)}
                        className="w-full px-4 py-2.5 text-left hover:bg-secondary/50 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <span className="text-sm font-medium text-foreground">{mat.name}</span>
                          <span className="text-[10px] text-muted-foreground ml-2">
                            Stock: {mat.currentStock} {mat.unit}
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-primary text-base opacity-0 group-hover:opacity-100 transition-opacity">
                          add_circle
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}

              {rawMaterials.length === 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-start gap-2">
                  <span className="material-symbols-outlined text-amber-500 text-base mt-0.5">
                    warning
                  </span>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    No raw materials available. Please add raw materials in the{" "}
                    <strong>Inventory</strong> section first before creating menu items.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button type="submit" disabled={loading} className="w-full font-bold">
              {loading ? "Creating..." : "Save Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
