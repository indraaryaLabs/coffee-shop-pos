import { create } from "zustand";
import type { Product } from "@/lib/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

interface CartStore {
  items: CartItem[];
  orderNumber: number;
  orderType: "dine_in" | "take_away";
  customerName: string;

  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  updateNotes: (productId: string, notes: string) => void;
  clearCart: () => void;
  setOrderType: (type: "dine_in" | "take_away") => void;
  setCustomerName: (name: string) => void;

  // Computed
  subtotal: () => number;
  tax: () => number;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  orderNumber: 1284,
  orderType: "dine_in",
  customerName: "Guest Checkout",

  addItem: (product: Product) => {
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { product, quantity: 1 }] };
    });
  },

  removeItem: (productId: string) => {
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    }));
  },

  incrementItem: (productId: string) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i
      ),
    }));
  },

  decrementItem: (productId: string) => {
    set((state) => {
      const item = state.items.find((i) => i.product.id === productId);
      if (item && item.quantity <= 1) {
        return { items: state.items.filter((i) => i.product.id !== productId) };
      }
      return {
        items: state.items.map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    });
  },

  updateNotes: (productId: string, notes: string) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId ? { ...i, notes } : i
      ),
    }));
  },

  clearCart: () => {
    set((state) => ({
      items: [],
      orderNumber: state.orderNumber + 1,
      customerName: "Guest Checkout",
    }));
  },

  setOrderType: (type) => set({ orderType: type }),
  setCustomerName: (name) => set({ customerName: name }),

  subtotal: () => {
    return get().items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  },

  tax: () => {
    return get().subtotal() * 0.085;
  },

  total: () => {
    return get().subtotal() + get().tax();
  },

  itemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
