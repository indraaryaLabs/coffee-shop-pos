import { create } from "zustand";
import { inventoryItems, InventoryItem } from "@/lib/data/inventory";

interface InventoryState {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, "id" | "status">) => void;
  restockLowItems: () => void;
  restockItem: (id: string, qty: number) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  items: inventoryItems,
  addItem: (newItem) =>
    set((state) => {
      const id = `inv-${Date.now()}`;
      const status = newItem.currentStock <= 5 ? "low_stock" : "in_stock";
      const image = newItem.image || "/images/matcha.jpg"; // Default fallback image

      const item: InventoryItem = {
        ...newItem,
        id,
        status,
        image,
      };

      return { items: [item, ...state.items] };
    }),
  restockLowItems: () =>
    set((state) => ({
      items: state.items.map((item) =>
        item.status === "low_stock"
          ? {
              ...item,
              currentStock: Math.max(item.currentStock + 20, 20),
              status: "in_stock",
            }
          : item
      ),
    })),
  restockItem: (id, qty) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              currentStock: item.currentStock + qty,
              status: item.currentStock + qty > 5 ? "in_stock" : "low_stock",
            }
          : item
      ),
    })),
}));
