"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTheme } from "next-themes";

interface WeeklyDataPoint {
  day: string;
  revenue: number;
  orders: number;
}

export function WeeklyRevenueChart({ data = [] }: { data?: WeeklyDataPoint[] }) {
  const [metric, setMetric] = useState<"revenue" | "orders">("revenue");
  const { resolvedTheme } = useTheme();

  // Find max value to color it differently
  const maxValue = data.length > 0 ? Math.max(...data.map((d) => d[metric])) : 0;
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);

  const baseColor = resolvedTheme === "dark" ? "#C08552" : "#E2C3A8";
  const hoverColor = resolvedTheme === "dark" ? "#FEBB84" : "#C08552";
  const maxColor = resolvedTheme === "dark" ? "#FEBB84" : "#8C5A3C";

  return (
    <div className="bg-secondary/50 rounded-xl p-8 relative overflow-hidden flex flex-col h-full">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h4 className="font-headline text-2xl font-bold text-foreground tracking-tight">
            Weekly Performance
          </h4>
          <p className="text-muted-foreground text-sm">
            Tracking for the last 7 days
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMetric("revenue")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              metric === "revenue"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-card/40"
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setMetric("orders")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              metric === "orders"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-card/40"
            }`}
          >
            Orders
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="flex gap-6 mb-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">trending_up</span>
          <span className="text-sm font-bold text-foreground">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-muted-foreground">total revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-accent text-base">receipt_long</span>
          <span className="text-sm font-bold text-foreground">
            {totalOrders}
          </span>
          <span className="text-xs text-muted-foreground">orders</span>
        </div>
      </div>

      <div className="flex-1 min-h-[220px]">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-30">bar_chart</span>
            <p className="text-sm font-medium">No data for this period</p>
            <p className="text-xs">Complete transactions to see weekly performance</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minHeight={220}>
            <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor", fontSize: 10, fontWeight: "bold", opacity: 0.4 }}
                dy={10}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card border border-border px-3 py-2 rounded-lg shadow-lg">
                        <p className="font-bold text-sm text-foreground">
                          {payload[0].payload.day}
                        </p>
                        <p className="text-primary font-headline font-bold">
                          {metric === "revenue"
                            ? `$${Number(payload[0].value).toLocaleString()}`
                            : `${payload[0].value} Orders`}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey={metric} radius={[6, 6, 0, 0]} animationDuration={1000}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry[metric] === maxValue && maxValue > 0 ? maxColor : baseColor}
                    className="hover:fill-[var(--chart-hover)] transition-all duration-300"
                    style={{ "--chart-hover": hoverColor } as React.CSSProperties}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
