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
import { weeklyRevenue } from "@/lib/data/transactions";
import { useTheme } from "next-themes";

export function WeeklyRevenueChart() {
  const [metric, setMetric] = useState<"revenue" | "orders">("revenue");
  const { resolvedTheme } = useTheme();

  // Find max value to color it differently
  const maxValue = Math.max(...weeklyRevenue.map((d) => d[metric]));

  const baseColor = resolvedTheme === "dark" ? "#C08552" : "#E2C3A8";
  const hoverColor = resolvedTheme === "dark" ? "#FEBB84" : "#C08552";
  const maxColor = resolvedTheme === "dark" ? "#FEBB84" : "#8C5A3C";

  return (
    <div className="bg-secondary/50 rounded-xl p-8 relative overflow-hidden flex flex-col h-full">
      <div className="flex justify-between items-end mb-8">
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

      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={220}>
          <BarChart data={weeklyRevenue} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
                          ? `$${payload[0].value?.toLocaleString()}`
                          : `${payload[0].value} Orders`}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey={metric} radius={[6, 6, 0, 0]} animationDuration={1000}>
              {weeklyRevenue.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry[metric] === maxValue ? maxColor : baseColor}
                  className="hover:fill-[var(--chart-hover)] transition-all duration-300"
                  style={{ "--chart-hover": hoverColor } as React.CSSProperties}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
