import { DashboardClient } from "./DashboardClient";
import { db } from "@/lib/db";
import { transactions, transactionItems, inventory, products } from "@/lib/db/schema";
import { eq, sql, desc, lte, and, gte } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  // 1. Revenue Today
  const [revResult] = await db
    .select({ total: sql<number>`COALESCE(sum(${transactions.totalAmount}), 0)` })
    .from(transactions)
    .where(sql`DATE(${transactions.createdAt}) = CURRENT_DATE`);
    
  const revenueToday = Number(revResult?.total || 0);

  // 2. Items Sold Today (not just cups — all product types)
  const [itemsResult] = await db
    .select({ items: sql<number>`COALESCE(sum(${transactionItems.quantity}), 0)` })
    .from(transactionItems)
    .innerJoin(transactions, eq(transactionItems.transactionId, transactions.id))
    .where(sql`DATE(${transactions.createdAt}) = CURRENT_DATE`);

  const itemsSold = Number(itemsResult?.items || 0);

  // 3. Low Stock Items — full details for the alert panel
  const lowStockItems = await db
    .select({
      productId: products.id,
      productName: products.name,
      category: products.category,
      currentStock: inventory.currentStock,
      unit: inventory.unit,
      status: inventory.status,
    })
    .from(inventory)
    .innerJoin(products, eq(inventory.productId, products.id))
    .where(lte(inventory.currentStock, 5))
    .orderBy(inventory.currentStock)
    .limit(10);

  const lowStockCount = lowStockItems.length;

  // 4. Recent Transactions
  const recentTx = await db
    .select({
      id: transactions.id,
      createdAt: transactions.createdAt,
      totalAmount: transactions.totalAmount,
      status: transactions.status,
      customerName: transactions.customerName,
      paymentMethod: transactions.paymentMethod,
    })
    .from(transactions)
    .orderBy(desc(transactions.createdAt))
    .limit(5);

  // 5. Top Sellers — aggregated from actual transaction items (all time, or today)
  const topSellersData = await db
    .select({
      productId: transactionItems.productId,
      productName: products.name,
      imageUrl: products.imageUrl,
      totalQty: sql<number>`COALESCE(sum(${transactionItems.quantity}), 0)`,
      totalRevenue: sql<number>`COALESCE(sum(${transactionItems.quantity} * ${transactionItems.priceAtTime}), 0)`,
    })
    .from(transactionItems)
    .innerJoin(products, eq(transactionItems.productId, products.id))
    .innerJoin(transactions, eq(transactionItems.transactionId, transactions.id))
    .where(eq(transactions.status, "completed"))
    .groupBy(transactionItems.productId, products.name, products.imageUrl)
    .orderBy(sql`sum(${transactionItems.quantity}) DESC`)
    .limit(5);

  // 6. Weekly Performance — last 7 days revenue & order count from DB
  const weeklyData = await db
    .select({
      day: sql<string>`TO_CHAR(${transactions.createdAt}, 'Dy')`,
      date: sql<string>`DATE(${transactions.createdAt})`,
      revenue: sql<number>`COALESCE(sum(${transactions.totalAmount}), 0)`,
      orders: sql<number>`count(*)`,
    })
    .from(transactions)
    .where(
      and(
        gte(transactions.createdAt, sql`CURRENT_DATE - INTERVAL '6 days'`),
        eq(transactions.status, "completed")
      )
    )
    .groupBy(sql`DATE(${transactions.createdAt})`, sql`TO_CHAR(${transactions.createdAt}, 'Dy')`)
    .orderBy(sql`DATE(${transactions.createdAt})`);

  // Build a full 7-day array (fill missing days with 0)
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyPerformance = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayLabel = dayNames[d.getDay()];
    const match = weeklyData.find((w) => w.date === dateStr);
    weeklyPerformance.push({
      day: dayLabel,
      revenue: match ? Number(match.revenue) : 0,
      orders: match ? Number(match.orders) : 0,
    });
  }

  return (
    <DashboardClient 
      revenueToday={revenueToday} 
      itemsSold={itemsSold} 
      lowStockCount={lowStockCount} 
      lowStockItems={lowStockItems}
      recentTx={recentTx} 
      topSellers={topSellersData.map((s) => ({
        name: s.productName,
        sold: Number(s.totalQty),
        revenue: Number(s.totalRevenue),
        image: s.imageUrl || "/images/placeholder.jpg",
      }))}
      weeklyPerformance={weeklyPerformance}
    />
  );
}
