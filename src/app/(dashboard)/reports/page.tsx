import { ReportsClient } from "./ReportsClient";
import { db } from "@/lib/db";
import { transactions } from "@/lib/db/schema";
import { sql, desc, eq, gte, sum, count } from "drizzle-orm";
import { user, transactionItems, products } from "@/lib/db/schema";

export default async function ReportsPage() {
  // Aggregate Historical Data
  const [metrics] = await db
    .select({
      totalRevenue: sql<number>`sum(${transactions.totalAmount})`,
      totalOrders: sql<number>`count(${transactions.id})`
    })
    .from(transactions);

  const totalRevenue = Number(metrics?.totalRevenue || 0);
  const totalOrders = Number(metrics?.totalOrders || 0);
  const avgTicket = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

  // Fetch all transactions for history with Cashier Name
  const dbTransactions = await db
    .select({
      id: transactions.id,
      createdAt: transactions.createdAt,
      totalAmount: transactions.totalAmount,
      status: transactions.status,
      customerName: transactions.customerName,
      paymentMethod: transactions.paymentMethod,
      cashierId: transactions.cashierId,
      cashierName: user.name,
    })
    .from(transactions)
    .leftJoin(user, eq(transactions.cashierId, user.id))
    .orderBy(desc(transactions.createdAt));

  // Volume Trends: Aggregate last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const recentTxs = dbTransactions.filter((tx) => tx.createdAt >= sevenDaysAgo);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const volumeMap = new Map();
  
  // Initialize last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    volumeMap.set(dayNames[d.getDay()], { revenue: 0, orders: 0 });
  }

  recentTxs.forEach((tx) => {
    const dayStr = dayNames[tx.createdAt.getDay()];
    const current = volumeMap.get(dayStr);
    if (current) {
      current.revenue += Number(tx.totalAmount);
      current.orders += 1;
    }
  });

  const volumeData = Array.from(volumeMap.entries()).map(([day, data]) => ({
    day,
    revenue: data.revenue,
    orders: data.orders,
  }));

  // Popular Category: Aggregate all time
  const categoryStats = await db
    .select({
      category: products.category,
      totalSold: sql<number>`sum(${transactionItems.quantity})`,
    })
    .from(transactionItems)
    .innerJoin(products, eq(transactionItems.productId, products.id))
    .groupBy(products.category)
    .orderBy(desc(sql`sum(${transactionItems.quantity})`))
    .limit(4);

  const totalItemsSoldAgg = categoryStats.reduce((acc, cat) => acc + Number(cat.totalSold), 0);
  
  const iconMap: Record<string, string> = {
    coffee: "coffee",
    pastry: "bakery_dining",
    food: "lunch_dining",
    merchandise: "local_mall",
  };

  const categoryData = categoryStats.map((c) => {
    const sold = Number(c.totalSold);
    const pct = totalItemsSoldAgg > 0 ? Math.round((sold / totalItemsSoldAgg) * 100) : 0;
    const catLower = c.category?.toLowerCase() || "";
    let icon = "category";
    if (catLower.includes("coffee") || catLower.includes("latte") || catLower.includes("espresso")) icon = iconMap.coffee;
    else if (catLower.includes("pastr") || catLower.includes("bread") || catLower.includes("cake")) icon = iconMap.pastry;
    else if (catLower.includes("food") || catLower.includes("toast")) icon = iconMap.food;
    else if (catLower.includes("merch") || catLower.includes("bean")) icon = iconMap.merchandise;

    return {
      label: c.category,
      pct: `${pct}%`,
      icon,
    };
  });

  const mappedTransactions = dbTransactions.map((tx) => ({
    id: tx.id.substring(0, 8).toUpperCase(),
    customer: tx.customerName || "Guest",
    rawDate: tx.createdAt.toISOString(),
    date: tx.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: tx.createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    cashier: tx.cashierName || tx.cashierId || "System",
    cashierInitials: (tx.cashierName || tx.cashierId || "S").substring(0, 2).toUpperCase(),
    paymentMethod: tx.paymentMethod,
    total: Number(tx.totalAmount),
    status: tx.status,
  }));

  return (
    <ReportsClient 
      totalRevenue={totalRevenue}
      totalOrders={totalOrders}
      avgTicket={avgTicket}
      transactions={mappedTransactions}
      volumeData={volumeData}
      categoryData={categoryData}
    />
  );
}
