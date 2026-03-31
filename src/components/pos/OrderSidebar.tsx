"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useCartStore } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function OrderSidebar() {
  const {
    items,
    orderNumber,
    orderType,
    customerName,
    incrementItem,
    decrementItem,
    removeItem,
    subtotal,
    tax,
    total,
    itemCount,
    clearCart,
  } = useCartStore();

  const [animateRef] = useAutoAnimate({ duration: 250 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImgError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Auto-scroll to bottom when new items are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [items.length]);

  if (!mounted) {
    return (
      <aside className="w-96 h-full bg-secondary/50 flex flex-col shadow-[-10px_0_30px_rgba(75,46,43,0.03)] z-10 flex-shrink-0 animate-pulse" />
    );
  }

  return (
    <aside className="w-96 h-full bg-secondary/50 flex flex-col shadow-[-10px_0_30px_rgba(75,46,43,0.03)] z-10 flex-shrink-0">
      {/* Order Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-headline font-extrabold text-2xl tracking-tight text-foreground">
            Order #{orderNumber}
          </h2>
          <Badge
            variant="default"
            className="bg-accent text-accent-foreground rounded-full text-xs font-bold uppercase tracking-wider"
          >
            {orderType === "dine_in" ? "Dining In" : "Take Away"}
          </Badge>
        </div>
        <p className="text-xs text-accent font-medium">
          Customer: {customerName}
        </p>
      </div>

      {/* Cart Items */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar px-6"
      >
        <div ref={animateRef} className="space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <span className="material-symbols-outlined text-5xl mb-4 opacity-30">
                shopping_cart
              </span>
              <p className="text-sm font-medium">No items yet</p>
              <p className="text-xs opacity-60 mt-1">
                Tap a product to add it
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4 group">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-card flex-shrink-0 border border-border relative">
                  {!imgErrors[item.product.id] ? (
                    <Image
                      unoptimized
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      onError={() => handleImgError(item.product.id)}
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <span className="text-2xl font-headline font-extrabold text-muted-foreground/40">
                        {item.product.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h4 className="font-bold text-sm text-foreground truncate">
                      {item.product.name}
                    </h4>
                    <span className="font-bold text-sm text-foreground ml-2 flex-shrink-0">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[10px] text-accent uppercase tracking-tighter mb-2">
                    {item.notes || item.product.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decrementItem(item.product.id)}
                      className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary/10 transition-colors active:scale-90"
                    >
                      <span className="material-symbols-outlined text-xs text-accent">
                        remove
                      </span>
                    </button>
                    <span className="text-sm font-bold text-foreground tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => incrementItem(item.product.id)}
                      className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary/10 transition-colors active:scale-90"
                    >
                      <span className="material-symbols-outlined text-xs text-accent">
                        add
                      </span>
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-sm text-destructive">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Summary & Checkout */}
      <div className="p-6 bg-secondary space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal ({itemCount()} items)</span>
            <span className="font-medium">${subtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Tax (8.5%)</span>
            <span className="font-medium">${tax().toFixed(2)}</span>
          </div>
          <div className="pt-2 flex justify-between items-end border-t border-accent/20">
            <span className="font-headline font-bold text-foreground">
              Total Amount
            </span>
            <span className="font-headline font-extrabold text-3xl text-foreground tabular-nums">
              ${total().toFixed(2)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => toast("Apply Voucher", { description: "Opening scanner..." })}
            className="flex flex-col items-center justify-center gap-1 h-16 rounded-xl bg-card border border-border text-accent hover:bg-primary/5 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">
              confirmation_number
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Voucher
            </span>
          </button>
          <button
            onClick={() => toast("Assign Customer", { description: "Fetching loyalty directory..." })}
            className="flex flex-col items-center justify-center gap-1 h-16 rounded-xl bg-card border border-border text-accent hover:bg-primary/5 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">
              person_add
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Customer
            </span>
          </button>
        </div>

        <Button
          onClick={() => {
            toast.success("Payment Successful!", { description: `Order #${orderNumber} processed.` });
            clearCart();
          }}
          disabled={items.length === 0}
          className="w-full py-6 rounded-2xl bg-primary text-primary-foreground font-headline font-extrabold text-xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          <span>Pay Now</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </Button>

        <p className="text-center text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em]">
          Transaction ID: AL-{orderNumber}-88B
        </p>
      </div>
    </aside>
  );
}
