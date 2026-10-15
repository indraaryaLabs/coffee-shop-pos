import React, { forwardRef } from "react";
import { CartItem } from "@/hooks/use-cart";

interface ThermalReceiptProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  orderNumber: number;
  transactionId?: string | null;
  cashierName?: string;
  customerName?: string;
  tableNumber?: string;
  paymentMethod?: string;
}

export const ThermalReceipt = forwardRef<HTMLDivElement, ThermalReceiptProps>(({
  items,
  subtotal,
  tax,
  total,
  orderNumber,
  transactionId,
  cashierName = "Cashier 1",
  customerName = "Guest",
  tableNumber,
  paymentMethod = "CASH",
}, ref) => {
  const date = new Date().toLocaleString("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <div ref={ref} className="hidden print:block fixed inset-0 bg-white text-black z-[9999] font-mono text-sm">
      <div className="max-w-[300px] mx-auto p-4 w-[80mm]">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-bold text-2xl mb-1">THE ATELIER</h1>
          <p className="text-xs">123 Coffee Avenue, Brew City</p>
          <p className="text-xs">Tel: (555) 123-4567</p>
        </div>

        <div className="flex justify-between text-xs mb-1">
          <span>Date:</span>
          <span>{date}</span>
        </div>
        <div className="flex justify-between text-xs mb-1">
          <span>Order #:</span>
          <span>{orderNumber}</span>
        </div>
        <div className="flex justify-between text-xs mb-1">
          <span>Cashier:</span>
          <span>{cashierName}</span>
        </div>
        {customerName !== "Guest Checkout" && (
          <div className="flex justify-between text-xs mb-1">
            <span>Customer:</span>
            <span>{customerName}</span>
          </div>
        )}

        {/* Separator */}
        <div className="border-t border-dashed border-black my-4"></div>

        {/* Line Items */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className="w-1/2">Item</span>
            <span className="w-1/6 text-center">Qty</span>
            <span className="w-1/3 text-right">Amount</span>
          </div>
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-xs mb-2">
              <span className="w-1/2 break-words truncate pr-2">{item.product.name}</span>
              <span className="w-1/6 text-center">{item.quantity}</span>
              <span className="w-1/3 text-right">
                ${(item.quantity * item.product.price).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="border-t border-dashed border-black my-4"></div>

        {/* Totals */}
        <div className="flex justify-between text-xs mb-1">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs mb-2">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-bold mb-4">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* Payment Type */}
        <div className="flex justify-between text-xs mb-1">
          <span>Customer:</span>
          <span>{customerName}</span>
        </div>
        {tableNumber && (
          <div className="flex justify-between text-xs mb-1 font-bold">
            <span>Table:</span>
            <span>{tableNumber}</span>
          </div>
        )}
        <div className="border-b border-dashed border-black my-2"></div>
        <div className="flex justify-between text-xs mb-4">
          <span>Paid By:</span>
          <span>{paymentMethod}</span>
        </div>

        <div className="border-t border-dashed border-black my-4"></div>

        {/* Footer */}
        <div className="text-center text-xs mt-6">
          <p className="font-bold mb-1">Thank You!</p>
          <p>Please come again</p>
          {transactionId && (
            <p className="mt-4 text-[10px] text-gray-400">Tx: {transactionId}</p>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body {
            background: white !important;
            margin: 0;
            padding: 0;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color: black !important;
          }
        }
      `}} />
    </div>
  );
});
